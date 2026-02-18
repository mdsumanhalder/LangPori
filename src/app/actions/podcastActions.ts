'use server';

import Parser from 'rss-parser';
import { Podcast } from '@/types';

// Estonian with Eli podcast feed (Podbean is cleaner)
const RSS_FEED_URL = 'https://estonianwitheli.podbean.com/feed.xml';

export async function fetchPodcasts(): Promise<Podcast[]> {
    try {
        const parser = new Parser({
            customFields: {
                item: ['itunes:duration', 'itunes:image'],
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml; q=0.1',
            }
        });

        console.log(`Fetching RSS feed from: ${RSS_FEED_URL}`);
        const feed = await parser.parseURL(RSS_FEED_URL);
        console.log(`Successfully fetched ${feed.items.length} episodes`);

        return feed.items.slice(0, 10).map((item, index) => {
            // Parse duration (format can be HH:MM:SS or seconds)
            let duration = 0;
            const durationStr = item['itunes:duration'];
            if (durationStr) {
                if (durationStr.includes(':')) {
                    const parts = durationStr.split(':').reverse();
                    duration = parseInt(parts[0]) + (parseInt(parts[1] || '0') * 60) + (parseInt(parts[2] || '0') * 3600);
                } else {
                    duration = parseInt(durationStr);
                }
            } else {
                duration = 600; // Default fallback 10 mins
            }

            // Clean up description/content for "transcript" text
            // RSS often has HTML in content:encoded or description
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rssItem = item as any;
            const rawContent = rssItem['content:encoded'] || rssItem.content || rssItem.description || '';
            const cleanContent = rawContent.replace(/<[^>]*>/g, '').trim();
            const shortDescription = (rssItem.contentSnippet || rssItem.description || '').substring(0, 150) + '...';

            return {
                id: index + 100, // Offset to avoid conflict with static IDs if mixed
                title: item.title || 'Untitled Episode',
                titleEn: item.title || 'Untitled Episode', // RSS only has one title
                description: shortDescription,
                descriptionEn: shortDescription,
                level: 'A2', // Assuming intermediate level for this podcast
                duration: duration,
                audioUrl: item.enclosure?.url || '',
                thumbnailUrl: rssItem['itunes:image'] || feed.image?.url,
                transcript: [
                    {
                        id: 0,
                        startTime: 0,
                        endTime: duration,
                        estonian: cleanContent || 'No description available.',
                        english: 'Translation not available for this episode.'
                    }
                ]
            };
        });
    } catch (error) {
        console.error('RSS Parser failed:', error);

        // Fallback: Try manual fetch and simple parsing
        try {
            console.log('Attempting fallback fetch...');
            const response = await fetch(RSS_FEED_URL);
            const text = await response.text();

            // Simple regex to extract items
            const items: Podcast[] = [];
            const itemRegex = /<item>([\s\S]*?)<\/item>/g;
            let match;
            let count = 0;

            while ((match = itemRegex.exec(text)) !== null && count < 10) {
                const itemContent = match[1];

                const getTag = (tag: string) => {
                    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
                    const m = regex.exec(itemContent);
                    return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim() : '';
                };

                const title = getTag('title');
                const description = getTag('description').replace(/<[^>]*>/g, '').substring(0, 150) + '...';
                const fullDescription = getTag('description').replace(/<[^>]*>/g, '');

                // Extract enclosure url
                const enclosureMatch = /<enclosure[^>]*url="([^"]*)"/.exec(itemContent);
                const audioUrl = enclosureMatch ? enclosureMatch[1] : '';

                // Extract duration (itunes:duration)
                const durationMatch = /<itunes:duration>(.*?)<\/itunes:duration>/.exec(itemContent);
                let duration = 600;
                if (durationMatch) {
                    const parts = durationMatch[1].split(':').reverse();
                    duration = parseInt(parts[0]) + (parseInt(parts[1] || '0') * 60) + (parseInt(parts[2] || '0') * 3600);
                }

                if (title && audioUrl) {
                    items.push({
                        id: 200 + count,
                        title: title,
                        titleEn: title,
                        description: description,
                        descriptionEn: description,
                        level: 'A2',
                        duration: duration,
                        audioUrl: audioUrl,
                        thumbnailUrl: '', // Regex too complex for image, skip for fallback
                        transcript: [
                            {
                                id: 0,
                                startTime: 0,
                                endTime: duration,
                                estonian: fullDescription || 'No description available.',
                                english: 'Translation not available for this episode.'
                            }
                        ]
                    });
                    count++;
                }
            }

            if (items.length > 0) {
                console.log(`Fallback fetch successful, found ${items.length} items`);
                return items;
            }

        } catch (fallbackError) {
            console.error('Fallback fetch failed:', fallbackError);
        }

        // Return a debug item if everything fails
        return [{
            id: 999,
            title: 'Debug Episode: Standard Parser Failed',
            titleEn: 'Debug Episode: Standard Parser Failed',
            description: `Error fetching RSS: ${(error as Error).message}. Fallback also failed.`,
            descriptionEn: `Error fetching RSS: ${(error as Error).message}. Fallback also failed.`,
            level: 'A1',
            duration: 60,
            audioUrl: '',
            transcript: []
        }];
    }
}
