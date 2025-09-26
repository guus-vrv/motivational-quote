import fetch from 'node-fetch';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const author = searchParams.get('author');

    if (!author) {
      return new Response(JSON.stringify({ error: 'Author parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Search Wikipedia for the author
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(author)}&format=json&origin=*`
    );
    const searchData = await searchRes.json();

    if (!searchData.query.search.length) {
      return new Response(JSON.stringify({ error: 'No Wikipedia page found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pageTitle = searchData.query.search[0].title;

    // Get a larger page image (try wide format)
    const imageRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&piprop=original&origin=*`
    );
    const imageData = await imageRes.json();
    const pages = imageData.query.pages;
    const pageId = Object.keys(pages)[0];
    const imageUrl = pages[pageId].original?.source || null;

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'No image found for author' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch author image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}