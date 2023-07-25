const keys = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY    
}

const handler = async (event) => {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=id&id=${event.body}&key=${keys.GOOGLE_API_KEY}`)
        const data = await response.json()
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }