const keys = {
  RAPID_API_KEY: process.env.RAPID_API_KEY 
}

const handler = async (event) => {
  try {
    const url = `https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/custom/?url=${event.body}&quality=192`
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': keys.RAPID_API_KEY,
        'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
      }
    }
    const response = await fetch(url, options)
    if(!response.ok) {
      throw {
        message: "Download API didn't cooperate.", 
        statusText: response.statusText,
        status: response.status
      }
    }
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