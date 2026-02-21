import JSZip from 'jszip';

/**
 * Extract plain text and metadata from an EPUB file.
 * EPUB is a zip with META-INF/container.xml, OPF, and XHTML content files.
 */
export interface EpubMeta {
    title: string;
    author?: string;
    language?: string;
}

export async function extractTextFromEpub(file: File): Promise<{ text: string; meta: EpubMeta }> {
    const zip = await JSZip.loadAsync(file);
    const containerXml = await zip.file('META-INF/container.xml')?.async('string');
    if (!containerXml) throw new Error('Invalid EPUB: no container.xml');

    const rootfileMatch = containerXml.match(/full-path="([^"]+)"/);
    const opfPath = rootfileMatch?.[1];
    if (!opfPath) throw new Error('Invalid EPUB: no rootfile in container');

    const opfDir = opfPath.includes('/') ? opfPath.replace(/\/[^/]+$/, '/') : '';
    const opfContent = await zip.file(opfPath)?.async('string');
    if (!opfContent) throw new Error('Invalid EPUB: OPF not found');

    const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null;
    if (!parser) throw new Error('DOMParser not available');

    const opfDoc = parser.parseFromString(opfContent, 'text/xml');
    const meta: EpubMeta = {
        title: file.name.replace(/\.epub$/i, ''),
        author: undefined,
        language: undefined
    };

    // OPF often uses dc: namespace; try DOM then regex fallback
    const dcNs = 'http://purl.org/dc/elements/1.1/';
    const tryDc = (name: string): string | null => {
        const byNs = opfDoc.getElementsByTagNameNS(dcNs, name);
        if (byNs[0]?.textContent?.trim()) return byNs[0].textContent.trim();
        const byLocal = opfDoc.getElementsByTagName(name);
        if (byLocal[0]?.textContent?.trim()) return byLocal[0].textContent.trim();
        const re = new RegExp(`<[^>]*:?${name}[^>]*>([^<]*)</[^>]*:?${name}>`, 'i');
        const m = opfContent.match(re);
        return m ? m[1].trim() : null;
    };
    const titleVal = tryDc('title');
    if (titleVal) meta.title = titleVal;
    const creatorVal = tryDc('creator');
    if (creatorVal) meta.author = creatorVal;
    const langVal = tryDc('language');
    if (langVal) meta.language = langVal.slice(0, 2);

    const opfNs = 'http://www.idpf.org/2007/opf';
    const manifest: Record<string, string> = {};
    const itemEls = opfDoc.getElementsByTagNameNS(opfNs, 'item').length
        ? opfDoc.getElementsByTagNameNS(opfNs, 'item')
        : opfDoc.getElementsByTagName('item');
    for (let i = 0; i < itemEls.length; i++) {
        const item = itemEls[i];
        const id = item.getAttribute('id');
        const href = item.getAttribute('href');
        const mt = item.getAttribute('media-type') ?? '';
        if (id && href && (mt.includes('html') || mt.includes('xml'))) {
            manifest[id] = href;
        }
    }

    const spine: string[] = [];
    const itemrefs = opfDoc.getElementsByTagNameNS(opfNs, 'itemref').length
        ? opfDoc.getElementsByTagNameNS(opfNs, 'itemref')
        : opfDoc.getElementsByTagName('itemref');
    for (let i = 0; i < itemrefs.length; i++) {
        const idref = itemrefs[i].getAttribute('idref');
        if (idref && manifest[idref]) spine.push(idref);
    }

    const textParts: string[] = [];
    for (const idref of spine) {
        const href = manifest[idref];
        if (!href) continue;
        const fullPath = opfDir ? opfDir + href : href;
        const xhtml = await zip.file(fullPath)?.async('string');
        if (!xhtml) continue;
        const doc = parser.parseFromString(xhtml, 'text/html');
        const body = doc.body;
        if (body) textParts.push(stripHtml(body.textContent || ''));
    }

    const text = textParts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
    return { text, meta };
}

function stripHtml(s: string): string {
    return s
        .replace(/\s+/g, ' ')
        .trim();
}
