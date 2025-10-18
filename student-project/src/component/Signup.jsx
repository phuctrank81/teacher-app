import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Link } from 'react-router-dom'

const Signup = () => {

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    })

    console.log(formData)
    function handleChange(event) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [event.target.name]:event.target.value
            }
        })
    }

    async function handleSubmit(e){
        e.preventDefault()
         
        try {
            const { data, error } = await supabase.auth.signUp( // Không có lỗi
            {
                email: formData.email,
                password: formData.password,
                options:{
                    data:{
                        firt_name: formData.fullName,
                    }
                }
            }
        )
        alert('Check your email for verification link')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder='Fullname'
                    name='fullName'
                    onChange={handleChange}
                />

                <input
                    placeholder='Email'
                    name='email'
                    onChange={handleChange}
                />

                <input
                    placeholder='Password'
                    name='password'
                    type='password'
                    onChange={handleChange}
                />
                <button type='sumbit'>
                    Sumbit
                </button>

            </form>
            Already have an account? <Link to ="/">Login</Link>
        </div>
    )
}

export default Signup