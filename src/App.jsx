import ReactModal from 'react-modal'
import BeatLoader from 'react-spinners/BeatLoader'
import { useState } from "react"

export default function App() {
  const [videoUrl, setVideoURL] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  async function downloadMp3() {
    if(await videoExists(videoUrl)) {     
      try {
        setLoading(true)
        setShowModal(true) 

        const serverFunction = "https://musical-daffodil-6853f7.netlify.app/.netlify/functions/rapidRequest"
        const options = {
            method: 'POST',
            headers: {
              'content-type': 'text/plain',
            },
            body: videoUrl
        }
        const response = await fetch(serverFunction, options)
        const data = await response.json()

        startDownload(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
        setVideoURL("")
      }
    } else {      
      setShowModal(true)    
    }
  }

  //initiate download by adding anchor tag with download attribute and clicking it
  function startDownload(data) {
    const link = document.createElement('a');
    link.href = data.link;
    link.setAttribute("download", `${data.title}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  }

  async function videoExists(url) {
      //check if the url contains a valid YouTube video ID
      const regEx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/

      //if url contains a proper video ID, match returns an array with the ID at position 1
      if(url.match(regEx)) {
        const id = url.match(regEx)[1]

        //check if video exists
        const serverFunction = "https://musical-daffodil-6853f7.netlify.app/.netlify/functions/youtubeRequest"
        const options = {
          method: 'POST',
          headers: {
              'content-type': 'text/plain',
          },
          body: id
        }
        const response = await fetch(serverFunction, options)
        const data = await response.json()

        // 0 = no video = falsey = false, 1 = video = truthy = true
        return data.items.length  
      } else {        
        return false
      }       
  }

  function updateInput(event) {
    setVideoURL(prevUrl => event.target.value)
  }

  return (
    <main>
      <h1>YouTube to MP3</h1>
      <div id="searchbar">
        <i className="fa-solid fa-magnifying-glass" />
        <input value={videoUrl} onChange={updateInput} type="text" placeholder="https://www.youtube.com/watch?v=exampleURL" />
        <button onClick={downloadMp3} disabled={isLoading}>{isLoading ? <BeatLoader style={{display: "inherit", marginTop: 5}}/> : "Download"}</button>
      </div> 

      <ReactModal
        isOpen={showModal}
        onAfterOpen={() => setTimeout(() => setShowModal(false), 2000)}
        onRequestClose={() => setShowModal(false)}
        shouldCloseOnOverlayClick={true}      
        shouldCloseOnEsc={true}
        closeTimeoutMS={500}
        className={"modal-content"}
        overlayClassName={"modal-overlay"}
        parentSelector={() => document.querySelector('#searchbar')}
        ariaHideApp={false}
      >
        {isLoading ? "Preparing download" : "Invalid URL!"}
      </ReactModal>
    </main>
  )
}