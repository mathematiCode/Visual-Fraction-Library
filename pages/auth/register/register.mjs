// const axios = require("axios")
const registerForm = document.querySelector("#forms_buttons-action")
// const submitButton = document.getElementById("forms_buttons-action")

const signupButton = document.getElementById("signup-button"),
  loginButton = document.getElementById("login-button"),
  userForms = document.getElementById("user_options-forms")

signupButton.addEventListener(
  "click",
  () => {
    userForms.classList.remove("bounceRight")
    userForms.classList.add("bounceLeft")
  },
  false
)

loginButton.addEventListener(
  "click",
  () => {
    userForms.classList.remove("bounceLeft")
    userForms.classList.add("bounceRight")
  },
  false
)

// ---

registerForm.addEventListener("click", async (event) => {
  event.preventDefault()
  console.log("submit")
  const username = document.querySelector("#username").value
  const email = document.querySelector("#email")
  const password = document.querySelector("#password").value
  const response = await register(username, email, password)
  console.log("checking payload\n", username, email, password)
  console.log(response)
})

const register = async (username, email, password) => {
  const response = await axios
    .post("https://apivfl.vercel.app/account/create", {
      name: username,
      email: email,
      password: password,
    })
    .catch((error) => {
      console.log(error)
    })

  console.log(response)

  if (response) {
    console.log("success")

    return response
  }

  console.log("error")
}

// const body = document.querySelector("body")

// create acct

// submitButton.addEventListener("click", async () => {
//   const docs = await axios.post("https://apivfl.vercel.app/account/create")
//   console.log(docs)
//   body.innerHTML = ""

//   body.innerHTML = docs.data
// })
