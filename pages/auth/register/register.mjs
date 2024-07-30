const axios = require("axios")

const registerForm = document.querySelector(".register-form")

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const username = document.querySelector("#username").value
  const email = document.querySelector("#email")
  const password = document.querySelector("#password").value
  const response = await register(username, email, password)
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

    setTimeout(() => {
      window.location.href = "./login/login.html"

      return response
    }, 500)
  }

  console.log("error")

  return
}

module.exports = { register }
