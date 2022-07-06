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
        let cast = []

        let title = $('h1.film-title').text()
        let native_title = $('ul.list.m-a-0').find('[class="list-item p-a-0"]').eq(0).find('a').text()
        let synopsis = $('div.show-synopsis').text().split('(Source:')[0].trim()
        if (synopsis.includes('Edit Translation')) {
            synopsis = "N/A"
        }
        let poster = $('div.col-sm-4.film-cover.cover').find('a.block').find('img').attr('src')
        let rating = $('div.box.deep-orange').text()

        // Details
        let country = $('ul.list.m-b-0').find('li').eq(1).find('b').text()
        if (country.includes('Country:')) {
            country = $('ul.list.m-b-0').find('li').eq(1).text().split(':')[1].trim()
        } else {
            country = ''
        }

        let total_ep = $('ul.list.m-b-0').find('li').eq(2).find('b').text()
        if (total_ep.includes('Episodes:')) {
            total_ep = $('ul.list.m-b-0').find('li').eq(2).text().split(':')[1].trim()
        } else {
            total_ep = ''
        }

        let air_date = $('ul.list.m-b-0').find('li').eq(3).find('b').text()
        if (air_date.includes('Aired:') || air_date.includes('Airs:')) {
            air_date = $('ul.list.m-b-0').find('li').eq(3).text().split(':')[1].trim()
        } else {
            air_date = ''
        }

        let aired_on = $('ul.list.m-b-0').find('li').eq(4).find('b').text()
        if (aired_on.includes('Aired On:') || aired_on.includes('Airs On:')) {
            aired_on = $('ul.list.m-b-0').find('li').eq(4).text().split(':')[1].trim()
        } else {
            aired_on = ''
        }

        let original_network = $('ul.list.m-b-0').find('li').eq(5).find('b').text()
        if (original_network.includes('Original Network:')) {
            original_network = $('ul.list.m-b-0').find('li').eq(5).text().split(':')[1].trim()
        } else {
            original_network = ''
        }

        let duration = $('ul.list.m-b-0').find('li').eq(6).find('b').text() 
        if (duration.includes('Duration:')) {
            duration = $('ul.list.m-b-0').find('li').eq(6).text().split(':')[1].trim()
        } else {
            duration = ''
        }

        let content_rating = $('ul.list.m-b-0').find('li').eq(7).find('b').text() 
        if (content_rating.includes('Content Rating:')) {
            content_rating = $('ul.list.m-b-0').find('li').eq(7).text().split(':')[1].trim()
        } else {
            content_rating = ''
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
            let cast_name = $(element).find('div.col-xs-8.col-sm-7.p-a-0').find('a').attr('title')
            let character_name = $(element).find('div.text-ellipsis').find('small').text()
            // let cast_image = $(element).find('div.col-xs-4.col-sm-5.p-r.p-l-0.credits-left').find('a').find('img').attr('src') //doesn't work because of lazy load
            let role_type = $(element).find('small.text-muted').text()
            cast.push({
                cast_name,
                character_name,
                role_type
            })
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
            },
            cast
        }

        return { result: data }
    })
}

module.exports = scrapeDetails