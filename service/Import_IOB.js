/** Import a tagged corpus.
 *
 * @author Christian Gawron
 * 
 * This module provides functionality to import existing annotated corpora, i.e. CoNLL or GermEval data sets.
 */

const fs = require('fs');
const readline = require('readline');

const corpusService = require("./CorpusService");
const documentService = require("./DocumentService");
const tagService = require("./TagService");
const annotationSetService = require("./AnnotationSetService");

class IOB_TSV_Importer {

    constructor(corpus, annotationSet) {
        this.corpus = corpus;
        this.annotationSet = annotationSet;
    }

    static async getImporter(corpus, annotationSet) {
        if (corpus instanceof String) {
            corpus = await corpusService.createOne({ name: corpus })
        }

        if (annotationSet instanceof String) {
            annotationSet = await annotationSetService.createOne({ name: annotationSet })
        }
        return new IOB_TSV_Importer(corpus, annotationSet);
    }

    async import(stream) {


        this.annotations = new Map()
        annotationSetService.getAnnotations(this.annotationSet.s_id)
            .then(annos => annos.forEach(anno => this.annotations.set(anno.name, anno)))
        console.log("annotations: %o", this.annotations)

        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });

        this.tagSet = new Set()
        this.text = ''
        this.tags = []

        let lines = []
        for await (const line of rl) {
            let fields = line.split('\t')
            if (fields[0].startsWith('#'))
                continue;
            else if (fields.length < 2) {
                const record = this.createRecord(lines);
                let offset = this.text.length;
                this.text += record.text + '\n';
                record.annotations.forEach((anno) => {
                    anno.start += offset;
                    anno.end += offset;
                    this.tags.push(anno);
                })
                lines = []
            }
            else {
                lines.push(fields);
            }
        }
        //console.log("text: %s", this.text)
        //console.log("annotation: %j", this.annotations)
        console.log("tagSet: %o", this.tagSet)

        let doc = await documentService.createOne({
            c_id: this.corpus.c_id,
            text: this.text,
            filename: "dev.txt"
        })

        this.tags.forEach(tag => {
            if (this.annotations.has(tag.name)) {
                tagService.createOne({
                    a_id: this.annotations.get(tag.name).a_id,
                    d_id: doc.d_id,
                    start_index: tag.start,
                    end_index: tag.end
                })
                    .catch(console.error)
            }
            else {
                console.warn("annotation %s not in annotation set %s [%o]",
                    tag.name, this.annotationSetName, this.annotations);
            }
        })
    }

    createRecord(lines) {
        let text = ''
        let annos = []
        let current = [null, null]
        let start = []
        let end = []

        lines.forEach((fields, i) => {
            //console.log(`${i} => ${fields}`)
            start[i] = text.length
            text += fields[1] + ' '
            end[i] = text.length - 1

            fields.slice(2).forEach((tag, j) => {
                //console.log(tag)
                if (tag[0] != 'I') {
                    // Is the a tag to end?
                    if (current[j] != null) {
                        current[j].end = end[i - 1]
                        annos.push(current[j])
                        current[j] = null
                    }
                }
                if (tag[0] == 'B') {
                    // start new tag
                    this.tagSet.add(tag.split('-')[1])
                    current[j] = {
                        start: start[i],
                        name: tag.split('-')[1]
                    }
                }
            })
        });
        for (let j = 0; j < current.length; j++) {
            if (current[j] != null) {
                current[j].end = end[end.length - 1]
                annos.push(current[j])
                current[j] = null
            }
        }
        return { text: text, annotations: annos }
    }
}

export default {
    provides: 'IOB TSV',
    create: IOB_TSV_Importer.getImporter
};


// importer = new IOB_TSV_Importer("GermEval NER", "NER")
// importer.read(fs.createReadStream(process.argv[2]))