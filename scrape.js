// Declare a route
import * as cheerio from 'cheerio';
import fetch from "node-fetch";

const scrape = async (fastify, options) => {
    fastify.get('/:type/:filter', async (request, reply) => {
        let { type, filter } = request.params
        let { page } = request.query
        if (!page) {
            page = 1
        }
        const res = await fetch(`https://mydramalist.com/${type}/${filter}?page=${page}`, Headers={'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36'})
        const html = await res.text()
        let data = []
        const $ = cheerio.load(html)
        $('div.m-t.nav-active-border.b-primary').find('div.box').each((index, element) => {z
            let title = $(element).find('h6.text-primary.title').find('a').text()
            let slug = $(element).find('h6.text-primary.title').find('a').attr('href').replace('/', '')
            // let poster = $(element).find('a.block > img').attr('src') //doesn't work because of lazy load
            let ranking = $(element).find('div.ranking.pull-right').text().replace('#', '')
            let rlsYear = $(element).find('span.text-muted').text().split('-')[1].trim().split(',')[0]
            let rating = $(element).find('p').eq(0).text().trim()
            let shortDescription = $(element).find('p').eq(1).text().trim()
            if (type != 'movies') {
                var language = $(element).find('span.text-muted').text().split('Drama')[0].trim()
                var totalEp = $(element).find('span.text-muted').text().split(',')[1].replace('episodes', '').trim()
                data.push({
                    ranking,
                    title,
                    slug,
                    rlsYear,
                    rating,
                    language,
                    totalEp,
                    shortDescription
                })
            } else {
                var language = $(element).find('span.text-muted').text().split('Movie')[0].trim()
                data.push({
                    ranking,
                    title,
                    slug,
                    rlsYear,
                    rating,
                    language,
                    shortDescription
                })
            }
        })
      return { result: data }
    })    
}

module.exports = scrape
