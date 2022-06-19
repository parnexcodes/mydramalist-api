// Declare a route
const cheerio = require('cheerio')
const axios = require('axios')

const scrapeDetails = async (fastify, options) => {
    fastify.get('/details/:id', async (request, reply) => {
        let { id } = request.params
        const res = await axios.get(`https://mydramalist.com/${id}`, Headers={'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36'})
        const html = await res.data
        const $ = cheerio.load(html)

        let alternate_title = []
        let genres = []
        let tags = []

        let title = $('h1.film-title').text()
        let native_title = $('ul.list.m-a-0').find('[class="list-item p-a-0"]').eq(0).find('a').text()
        let synopsis = $('div.show-synopsis').text().split('(Source:')[0].trim()
        if (synopsis.includes('Edit Translation')) {
            synopsis = "N/A"
        }
        let poster = $('div.col-sm-4.film-cover.cover').find('a.block').find('img').attr('src')
        let rating = $('div.box.deep-orange').text()
        let country = $('ul.list.m-b-0').find('li').eq(1).text().split(':')[1].trim()
        let total_ep = $('ul.list.m-b-0').find('li').eq(2).text().split(':')[1].trim()
        let air_date = $('ul.list.m-b-0').find('li').eq(3).text().split(':')[1].trim()
        let aired_on = $('ul.list.m-b-0').find('li').eq(4).text().split(':')[1].trim()

        let original_network = $('ul.list.m-b-0').find('li').eq(5).find('b').text()
        if (!original_network.includes('Original Network:')) {
            original_network = ''
        } else {
            original_network = $('ul.list.m-b-0').find('li').eq(5).text().split(':')[1].trim()
        }

        let duration = $('ul.list.m-b-0').find('li').eq(6).find('b').text() 
        if (!duration.includes('Duration:')) {
            duration = ''
        } else {
            duration = $('ul.list.m-b-0').find('li').eq(6).text().split(':')[1].trim()
        }

        let content_rating = $('ul.list.m-b-0').find('li').eq(7).find('b').text() 
        if (!content_rating.includes('Content Rating:')) {
            content_rating = ''
        } else {
            content_rating = $('ul.list.m-b-0').find('li').eq(7).text().split(':')[1].trim()
        }
        
        // Alternate Title
        $('[class="list-item p-a-0 show-genres"]').find('a').each((index, element) => {
            let genre = $(element).text()
            let genre_id = $(element).attr('href').split('&ge=')[1].split('&')[0]
            genres.push({
                genre_id,
                genre
            })
        })
        
        // Genre
        $('span.mdl-aka-titles').find('a').each((index, element) => {
            let alternate_title_elements = $(element).text()
            alternate_title.push(alternate_title_elements)
        })

        // Tags
        $('[class="list-item p-a-0 show-tags"]').find('a').each((index, element) => {
            let tag = $(element).text()
            let tag_id = $(element).attr('href').split('&th=')[1]?.split('&so=')[0]
            tags.push({
                tag_id,
                tag
            })

            if (tag.includes('(Vote or add tags)')) {
                tags.pop()
            }
        })

        // Cast
        $('ul.list.no-border.p-b.credits').find('li').each((index, element) => {
            let cast_name = $(element).find('a < img').attr('src')
        })

        let data = {
            poster,
            rating,
            title,
            synopsis,
            native_title,
            alternate_title,
            genres,
            tags,
            details: {
                country,
                total_ep,
                air_date,
                aired_on,
                original_network,
                duration,
                content_rating
            }
        }

        return { result: data }
    })
}

module.exports = scrapeDetails