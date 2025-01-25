const searchInput = document.querySelector(".search");
const user = document.querySelector(".name");
const userName = document.querySelector(".username");
const userBio = document.querySelector(".bio");
const followers = document.querySelector(".followers");
const following = document.querySelector(".following");
const repos = document.querySelector(".repository");
const avatar = document.querySelector(".avatar");
const repositoryList = document.querySelector(".repository-list");
const profileContainer = document.querySelector(".profile-container");
const container = document.querySelector(".container"); // Assuming you have a container for general content

const API_URL = `https://api.github.com/users/`;

// Default username for initial load (orhanturkmenoglu)
const defaultUsername = "orhanturkmenoglu";

// Set initial dynamic default values from API
async function setDefaultValues() {
  try {
    const response = await fetch(API_URL + defaultUsername);
    if (!response.ok) {
      throw new Error("Default user not found");
    }
    const data = await response.json();

    // Set the profile container with default user data
    avatar.src = data.avatar_url || "https://via.placeholder.com/150";
    user.textContent = data.name || "Loading...";
    userName.textContent = data.login || "Loading...";
    userBio.textContent = data.bio || "Fetching bio...";
    followers.textContent = `Followers: ${data.followers || 0}`;
    following.textContent = `Following: ${data.following || 0}`;
    repos.textContent = `Repositories: ${data.public_repos || 0}`;

    // Set up repositories list for default user
    getRepositories(defaultUsername);

    // Handle any potential errors if the data is not found
  } catch (error) {
    console.error(error);
    showMessage("Error loading default user data: " + error.message);
  }
}

// Call setDefaultValues to load the default user information initially
setDefaultValues();

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const username = searchInput.value.trim();
    if (username) {
      getProfileDetails(username);
    } else {
      showMessage("Please enter a valid username");
    }
  }
});

async function getProfileDetails(username) {
  try {
    const response = await fetch(API_URL + username);
    if (!response.ok) {
      throw new Error("User not found");
    }
    const data = await response.json();
    console.log(data);
    console.log(data.name);
    console.log(data.login);

    // Hide error message if any
    hideMessage();

    // Show profile details
    avatar.src = data.avatar_url || "https://via.placeholder.com/150";
    user.textContent = data.name || "Name not available";
    userName.textContent = data.login || "Name not available";
    userBio.textContent = data.bio || "Bio not available";
    followers.textContent = `Followers: ${data.followers || 0}`;
    following.textContent = `Following: ${data.following || 0}`;
    repos.textContent = `Repositories: ${data.public_repos || 0}`;

    // Repositories list
    getRepositories(username);
  } catch (error) {
    console.error(error);
    showMessage(error.message);
  }
}

// Repositories list fetch and display
async function getRepositories(username) {
  try {
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    if (!reposResponse.ok) {
      throw new Error("Repositories not found");
    }
    const reposData = await reposResponse.json();

    repositoryList.innerHTML = ``;

    reposData.forEach((repo) => {
      const repoItem = document.createElement("span");
      repoItem.classList.add("repo-item");
      repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
      repositoryList.appendChild(repoItem);
    });
  } catch (error) {
    console.error(error);
    showMessage("Error fetching repositories: " + error.message);
  }
}

// Show message function to handle both success and error messages
function showMessage(message, isError = true) {
  // Hide profile container
  profileContainer.style.display = "none";

  // Check if errorContainer exists or needs to be created
  let errorContainer = document.querySelector(".error-message");
  if (!errorContainer) {
    errorContainer = document.createElement("div");
    errorContainer.classList.add("error-message");
    container.appendChild(errorContainer); // Appending to container
  }

  // Set the error message text and styles
  errorContainer.textContent = message;
  errorContainer.style.display = "block";
  if (isError) {
    errorContainer.style.color = "red"; // Error messages in red
    errorContainer.style.fontWeight = "bold";
  } else {
    errorContainer.style.color = "green"; // Success messages in green
  }
}

function hideMessage() {
  // Show profile container and hide error message
  profileContainer.style.display = "block";
  const errorContainer = document.querySelector(".error-message");
  if (errorContainer) {
    errorContainer.style.display = "none";
  }
}
