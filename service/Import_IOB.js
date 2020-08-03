/** Import a tagged corpus.
 *
 * @author Christian Gawron
 * 
 * This module provides functionality to import existing annotated corpora, i.e. CoNLL or GermEval data sets.
 */


const readline = require('readline');
const { v4: uuidv4 } = require('uuid');

const corpusService = require("./CorpusService");
const documentService = require("./DocumentService");
const tagService = require("./TagService");
const annotationSetService = require("./AnnotationSetService");

class IOB_TSV_Importer {

    constructor(corpus, annotationSet) {
        this.corpus = corpus;
        this.annotationSet = annotationSet;
    }

    static getImporter(corpus, annotationSet) {

        return new IOB_TSV_Importer(corpus, annotationSet);
    }

    async import(stream) {
        console.log('import: %s %s', typeof (this.annotationSet), typeof (this.corpus));

        if (typeof (this.corpus) === 'string' || this.corpus instanceof String) {
            console.log('getting/creating corpus');
            this.corpus = await corpusService.createOne({ name: this.corpus });

            // console.log('corpus: %o', this.corpus);
        }

        if (typeof (this.annotationSet) === 'string' || this.annotationSet instanceof String) {
            this.annotationSet = await annotationSetService.createOne({ name: this.annotationSet });
            // console.log('annotationSet: %o', this.annotationSet);
        }

        //console.log('using Importer: %o %o', this.corpus, this.annotationSet);


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
            filename: `${uuidv4()}.txt`
        })

        this.tags.forEach(async (tag) => {
            if (this.annotations.has(tag.name)) {
                try {
                    await tagService.createOne({
                        a_id: this.annotations.get(tag.name).a_id,
                        d_id: doc.d_id,
                        start_index: tag.start,
                        end_index: tag.end
                    });
                    // await new Promise(resolve => setTimeout(resolve, 500));
                }
                catch (err) {
                    console.error('failed to create tag %o: %o', tag, err);
                    // await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
            else {
                console.warn("annotation %s not in annotation set %s [%o]",
                    tag.name, this.annotationSetName, this.annotations);
            }
        });
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

module.exports = {
    provides: ['text/tab-separated-values', 'IOB TSV', 'NoSta-D'],
    description: 'IOB format used by [NoSta-D](https://www.aclweb.org/anthology/L14-1251/)',
    create: IOB_TSV_Importer.getImporter
};


