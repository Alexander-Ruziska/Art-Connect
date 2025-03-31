import React from "react"
import useStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function IdeaForm(props) {
  //Zustand store info
    const addIdea = useStore((store) => store.addIdea);

  //State changes
  const [titleInput, setTitleInput] = useState('');
  const [ideaInput, setIdeaInput] = useState('');


//This is the form handler to add the new ideas once the submit button is clicked on
    const formHandler = (event) => {
      event.preventDefault();

      const newIdea = {
        title: titleInput,
        idea: ideaInput
      }

      console.log('New idea', newIdea);

      addIdea(newIdea);

      //this is getting rid of the prior inputs in the form
      setTitleInput('');
      setIdeaInput('');

    }


  return (
    <div>
      <h3>New Idea Form:</h3>
      <p>Input your new idea or project below to let organizations know what you're wanting to do/doing</p>
      <section>
        <form id='ideaForm' onSubmit={formHandler}>

        {/* title */}
        <label>Title of Project:</label>
        <input type="text" placeholder='Title' value={titleInput} onChange={(e) => setTitleInput(e.target.value)} required/>

        {/* idea */}
        <label>Idea description:</label>
        <input type="textarea" placeholder='Description' value={ideaInput} onChange={(e) => setIdeaInput(e.target.value)} required/>

        <button>Submit idea</button>

        </form>
      </section>
    </div>
  )
};

export default IdeaForm;
