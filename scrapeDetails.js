// Declare a route
const cheerio = require('cheerio')
const fetch = require('node-fetch')

const scrapeDetails = async (fastify, options) => {
    fastify.get('/details/:id', async (request, reply) => {
        let { id } = request.params
        const res = await fetch(`https://mydramalist.com/${id}`)
        const html = await res.text()
        const $ = cheerio.load(html)

        let alternateTitle = []
        let genres = []
        let tags = []

        let title = $('h1.film-title').text()
        let nativeTitle = $('ul.list.m-a-0').find('[class="list-item p-a-0"]').eq(0).find('a').text()
        let synopsis = $('div.show-synopsis').text().trim().split('(Source:')[0].trim()
        if (synopsis.includes('Edit Translation')) {
            synopsis = "N/A"
        }
        let poster = $('div.col-sm-4.film-cover.cover').find('a.block').find('img').attr('src')
        let rating = $('div.box.deep-orange').text()
        let country = $('ul.list.m-b-0').find('li').eq(1).text().split(':')[1].trim()
        let totalEp = $('ul.list.m-b-0').find('li').eq(2).text().split(':')[1].trim()
        let airDate = $('ul.list.m-b-0').find('li').eq(3).text().split(':')[1].trim()
        let airedOn = $('ul.list.m-b-0').find('li').eq(4).text().split(':')[1].trim()

        let originalNetwork = $('ul.list.m-b-0').find('li').eq(5).find('b').text()
        if (!originalNetwork.includes('Original Network:')) {
            originalNetwork = ''
        } else {
            originalNetwork = $('ul.list.m-b-0').find('li').eq(5).text().split(':')[1].trim()
        }

        let duration = $('ul.list.m-b-0').find('li').eq(6).find('b').text() 
        if (!duration.includes('Duration:')) {
            duration = ''
        } else {
            duration = $('ul.list.m-b-0').find('li').eq(6).text().split(':')[1].trim()
        }

        let contentRating = $('ul.list.m-b-0').find('li').eq(7).find('b').text() 
        if (!contentRating.includes('Content Rating:')) {
            contentRating = ''
        } else {
            contentRating = $('ul.list.m-b-0').find('li').eq(7).text().split(':')[1].trim()
        }
        
        // Alternate Title
        $('[class="list-item p-a-0 show-genres"]').find('a').each((index, element) => {
            let genre = $(element).text()
            let genreID = $(element).attr('href').split('&ge=')[1].split('&')[0]
            genres.push({
                genreID,
                genre
            })
        })
        
        // Genre
        $('span.mdl-aka-titles').find('a').each((index, element) => {
            let alternateTitleElements = $(element).text()
            alternateTitle.push(alternateTitleElements)
        })

        // Tags
        $('[class="list-item p-a-0 show-tags"]').find('a').each((index, element) => {
            let tag = $(element).text()
            let tagID = $(element).attr('href').split('&th=')[1]?.split('&so=')[0]
            tags.push({
                tagID,
                tag
            })

            if (tag.includes('(Vote or add tags)')) {
                tags.pop()
            }
        })

        let data = {
            poster,
            rating,
            title,
            synopsis,
            nativeTitle,
            alternateTitle,
            genres,
            tags,
            details: {
                country,
                totalEp,
                airDate,
                airedOn,
                originalNetwork,
                duration,
                contentRating
            }
        }

        return { result: data }
    })
}

module.exports = scrapeDetails