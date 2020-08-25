import { Inject, Singleton } from "typescript-ioc";
import { CorpusRepository } from "../../persistence/dao/CorpusRepository";
import { Document } from "../../persistence/model/Document";
import { Corpus } from '../../persistence/model/Corpus';
import { AnnotationSet } from '../../persistence/model/AnnotationSet';
import { createInterface } from "readline";
import * as fs from "fs";
import { Tag } from '../../persistence/model/Tag';
import { DocumentRepository } from '../../persistence/dao/DocumentRepository';
import Hashing from "../../util/Hashing";
import { TagRepository } from '../../persistence/dao/TagRepository';
import { Annotation } from '../../persistence/model/Annotation';
import { AnnotationSetRepository } from '../../persistence/dao/AnnotationSetRepository';
import { AnnotationRepository } from '../../persistence/dao/AnnotationRepository';
import { InternalServerError } from 'typescript-rest/dist/server/model/errors';
import { Readable } from 'stream';

@Singleton
export class CorpusImportService {

    @Inject
    private corpusRepository!: CorpusRepository


    public async import(name: string, annotationSetName: string, files: Express.Multer.File[]): Promise<Corpus> {
        let corpus: Corpus = await this.corpusRepository.save({ name: name, description: "Imported Corpus" } as Corpus)

        /** @todo Chose importer by file type */
        const importer = new NoStaDImporter(corpus)
        // import files as documents and tags
        try {
            files.forEach(async (file) => await importer.importFile(corpus, file, annotationSetName))
        }
        catch (ex) {
            throw new InternalServerError("Exception in importFile: " + ex)
        }

        // save corpus
        return this.corpusRepository.save(corpus)
    }
}

interface Marker {
    start: number
    end: number
    name: string
}

interface Record {
    text: string;
    annotations: Marker[]
    tagSet: Set<string>
}

/** Import files in the NoSta-D format.  
 * See {@link https://www.linguistik.hu-berlin.de/de/institut/professuren/korpuslinguistik/forschung/nosta-d} 
 * for a description of the format.
 */
class NoStaDImporter {
    @Inject
    private corpusRepository!: CorpusRepository

    @Inject
    private documentRepository!: DocumentRepository

    @Inject
    private tagRepository!: TagRepository

    @Inject
    private annotationRepository!: AnnotationRepository

    @Inject
    private annotationSetRepository!: AnnotationSetRepository

    corpus: Corpus;

    constructor(corpus: Corpus) {
        this.corpus = corpus
    }

    createRecord(lines: string[][]): Record {
        let text = ''
        let annos: Marker[] = []
        let current: (Marker | null)[] = [null, null]
        let start: number[] = []
        let end: number[] = []
        let tagSet = new Set<string>()

        lines.forEach((fields, i) => {
            start[i] = text.length
            text += fields[1] + ' '
            end[i] = text.length - 1

            fields.slice(2).forEach((tag, j) => {
                if (tag[0] != 'I') {
                    // Is the a tag to end?
                    let marker = current[j]
                    if (marker != null) {
                        marker.end = end[i - 1]
                        annos.push(marker)
                        current[j] = null
                    }
                }
                if (tag[0] == 'B') {
                    // start new tag
                    tagSet.add(tag.split('-')[1])
                    current[j] = {
                        start: start[i],
                        end: -1,
                        name: tag.split('-')[1]
                    }
                }
            })
        });

        current.forEach((marker, j) => {
            if (marker) {
                marker.end = end[end.length - 1]
                annos.push(marker)
            }
        })

        return { text: text, annotations: annos, tagSet: tagSet }
    }

    async importFile(corpus: Corpus, file: Express.Multer.File, annotationSetName: string) {
        let tagSet = new Set<string>()
        let stream = Readable.from(file.buffer)
        let input = createInterface({
            input: stream,
            crlfDelay: Infinity
        })

        let text = ""
        let lines: string[][] = []
        let tags: Marker[] = []
        for await (const line of input) {
            let fields = line.split('\t')
            if (fields[0].startsWith('#'))
                continue;

            // Start of a new record in the IOB file
            if (fields.length < 2) {
                const record = this.createRecord(lines);
                record.tagSet.forEach((tag) => tagSet.add(tag));
                let offset = text.length;
                text += record.text + '\n';
                record.annotations.forEach((anno) => {
                    anno.start += offset;
                    anno.end += offset;
                    tags.push(anno);
                })
                lines = []
            }
            else {
                lines.push(fields);
            }
        }

        // Get all annotations supported by 
        let annotationMap = new Map<string, Annotation>()
        if (corpus.annotationSets) {
            corpus.annotationSets.forEach((annotationSet) => {
                annotationSet.annotations.forEach((annotation) => {
                    annotationMap.set(annotation.name, annotation)
                })
            })
        }

        // Get the tags wich are not already present and create a new AnnotationSet
        const newTags = [...tagSet].filter((name) => !annotationMap.has(name))
        console.log('new tags: %o', newTags)

        if (newTags.length > 0) {
            try {
                // if there is altready an AnnotationSet with the requested name, use and amend it
                let mayBeAnnotationSet = await this.annotationSetRepository.getByName(annotationSetName)
                let annotationSet: AnnotationSet = mayBeAnnotationSet ? mayBeAnnotationSet :
                    await this.annotationSetRepository.save({
                        name: annotationSetName,
                        description: "Imported from " + file.filename
                    } as AnnotationSet)
                corpus.addAnnotationSet(annotationSet)

                this.corpusRepository.save(corpus)

                newTags.forEach(async (name) => {
                    try {
                        let annotation: Annotation = await this.annotationRepository.save({
                            name: name,
                            annotationSetId: annotationSet.annotationSetId
                        } as Annotation)
                        annotationMap.set(annotation.name, annotation)
                    }
                    catch (ex) {
                        console.log('failed to create annotation "' + name + '": ' + ex)
                        throw new InternalServerError('failed to create annotation "' + name + '": ' + ex)
                    }
                })
                this.annotationSetRepository.save(annotationSet)
            }
            catch (ex) {
                console.log('failed to create annotationset"' + annotationSetName + '": ' + ex)
                throw new InternalServerError('failed to create annotationset: ' + ex)
            }
        }

        let document: Document = await this.documentRepository.save({
            filename: file.filename ? file.filename : "Import_" + Hashing.sha256Hash(file.buffer),
            content: text,
            corpusId: corpus.corpusId,
            documentHash: Hashing.sha256Hash(text)
        } as Document, { raw: true })
        console.log('documentId: %o', document.documentId)

        console.log('saving tags')
        tags.forEach(async (marker) => {
            let annotation = annotationMap.get(marker.name)
            if (annotation) {
                let tag = await this.tagRepository.save({
                    annotationId: annotation.annotationId,
                    startIndex: marker.start,
                    endIndex: marker.end,
                    documentId: document.documentId
                } as Tag)
                console.log('tag saved: %o %d %d', tag.id, tag.startIndex, tag.endIndex)
            }
            else {
                console.log('no annotation found for tag name %s', marker.name)
            }
        })
        this.documentRepository.save(document)
    }
}
