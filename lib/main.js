const URL = require('url');
const HTTPS = require('https');
const chrono = require('chrono-node');
/* temporary */
const responseType = {
    live: true,
    ad: true,
    videoId: '',
    title: '',
    duration: 0, // length seconds -1 if live
    author_name: '',
    author_url: '',
    upload_at_text: '',
    upload_at: Date,
    view_count: 0,
    thumbnail: '',
    premium: false,
    premiere: false
};

const getTextFromObject = (item) => !item['simpleText'] ? item['runs'].map(o => o['text']).join() : item['simpleText'];

const getUrlFromNavigationEndpoint = (item) => item['browseEndpoint']['browseId'];

const hmsToSeconds = (duration) => duration.split(':').map(o => parseInt(o)).reverse().reduce((t, n, i) => {
    return t + n * Math.pow(60, i)
});

const parseVideoInfo = (item) => {
    const isLiveStream = !item['badges'] ? false : (item['badges'].findIndex((badge) => {
        return badge['metadataBadgeRenderer']['label'] === 'LIVE NOW'
    }) > -1 || (item['thumbnailOverlays'][0]['thumbnailOverlayTimeStatusRenderer']['style'].toLowerCase() === 'live'));
    const isPremiere = item['upcomingEventData'] !== undefined;
    const isPremium = !item['badges'] ? false : item['badges'].findIndex((badge) => {
        return badge['metadataBadgeRenderer']['label'] === 'Premium'
    }) > -1;
    const title = getTextFromObject(item['title']);
    const isAd = isPremiere || ['[Private video]', '[Deleted video]'].includes(title);
    const duration = isLiveStream ? -1 : hmsToSeconds(getTextFromObject(item['lengthText'] || item['thumbnailOverlays']
        .filter(o => o['thumbnailOverlayTimeStatusRenderer'] !== undefined)[0]['thumbnailOverlayTimeStatusRenderer']['text']));
    const author_name = getTextFromObject(item['longBylineText'] || item['ownerText'] || item['shortBylineText']);
    const author_url = getUrlFromNavigationEndpoint(item['longBylineText']['runs'][0]['navigationEndpoint']
        || item['ownerText']['runs'][0]['navigationEndpoint'] || item['shortBylineText']['runs'][0]['navigationEndpoint']);
    const uploaded_at_text = chrono.parseDate(getTextFromObject(item['publishedTimeText']));
    const view_count = !item['viewCountText'] ? -1 :
        (getTextFromObject(item['viewCountText']).toLowerCase() === 'no views' ? 0 :
            getTextFromObject(item['viewCountText']).toLowerCase() === 'recommended' ? -1 :
                parseInt(getTextFromObject(item['viewCountText']).replace(/\D/g, '')));
    return {
        live: isLiveStream,
        ad: isAd,
        video_id: item['videoId'],
        title: title,
        description: getTextFromObject(item['descriptionSnippet']),
        duration: duration, // length seconds -1 if live
        author_name: author_name,
        author_url: author_url,
        upload_at_text: uploaded_at_text,
        view_count: view_count,
        premium: isPremium,
        premiere: isPremiere
    }
};

const parseItems = (response) => {
    let result = [];
    response = JSON.parse(response);
    let itemSectionRenderers = response[1]['response']['contents']['twoColumnBrowseResultsRenderer']
        ['tabs'][0]['tabRenderer']['content']['sectionListRenderer']['contents'];
    itemSectionRenderers.forEach((itemSectionRenderer) => {
        let expandedShelfContentsRenderer = itemSectionRenderer['itemSectionRenderer']['contents'][0]['shelfRenderer']
            ['content']['expandedShelfContentsRenderer'];
        if (expandedShelfContentsRenderer) {
            result.push(...expandedShelfContentsRenderer['items'].map((item) => {
                return parseVideoInfo(item['videoRenderer'])
            }))
        }
    });
    return result
};

module.exports = (cb) => {
    const request = HTTPS.get('https://www.youtube.com/feed/trending?pbj=1&gl=US', {
            headers: {
                'X-YouTube-Client-Name': '1',
                'X-YouTube-Client-Version': '2.20200417.04.01'
            }
        },
        resp => { // eslint-disable-line consistent-return
            if (resp.statusCode !== 200) return cb(new Error(`Status Code ${resp.statusCode}`));
            const respBuffer = [];
            resp.on('data', d => respBuffer.push(d));
            resp.on('end', () => {
                cb(parseItems(Buffer.concat(respBuffer).toString()));
            });
        }
    );
    request.on('error', console.error);
};
