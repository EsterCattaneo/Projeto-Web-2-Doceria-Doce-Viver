'use strict';

// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');
var titleInput = document.getElementById('new-post-title');
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var splashPage = document.getElementById('page-splash');
var addPost = document.getElementById('add-post');
var addButton = document.getElementById('add');
var recentPostsSection = document.getElementById('recent-posts-list');
var userPostsSection = document.getElementById('user-posts-list');
var topUserPostsSection = document.getElementById('top-user-posts-list');
var recentMenuButton = document.getElementById('menu-recent');
var myPostsMenuButton = document.getElementById('menu-my-posts');
var myTopPostsMenuButton = document.getElementById('menu-my-top-posts');
var listeningFirebaseRefs = [];

/**
 * Saves a new post to the Firebase DB.
 */
function writeNewPost(uid, username, picture, title, body, imageUrl) {
  // Dados do post
  var postData = {
      author: username,
      uid: uid,
      body: body,
      title: title,
      starCount: 0,
      authorPic: picture,
      imageUrl: imageUrl // Adicionar a URL da imagem aqui
  };

  // Gerar uma nova chave para o post
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Atualizar os dados do novo post no Firebase Database
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

/**
 * Star/unstar post.
 */
function toggleStar(postRef, uid) {
  postRef.transaction(function(post) {
    if (post) {
      if (post.stars && post.stars[uid]) {
        post.starCount--;
        post.stars[uid] = null;
      } else {
        post.starCount++;
        if (!post.stars) {
          post.stars = {};
        }
        post.stars[uid] = true;
      }
    }
    return post;
  });
}

/**
 * Creates a post element.
 */
function createPostElement(postId, title, text, author) {
  var html = `
    <div class="post mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid">
      <div class="mdl-card mdl-shadow--2dp">
        <div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">
          <h4 class="mdl-card__title-text">${title}</h4>
        </div>
        <div class="header">
          <div>
            <div class="avatar"></div>
            <div class="username mdl-color-text--black">${author || 'Anonymous'}</div>
          </div>
        </div>
        <span class="star">
          <div class="not-stared material-icons">star_border</div>
          <div class="starred material-icons">star</div>
          <div class="star-count">0</div>
        </span>
        <div class="text">${text}</div>
      </div>
    </div>
  `;

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;

  // Lookup elements
  var star = postElement.getElementsByClassName('starred')[0];
  var unStar = postElement.getElementsByClassName('not-stared')[0];
  var starCount = postElement.getElementsByClassName('star-count')[0];

  // Set values
  var authorNameElement = postElement.getElementsByClassName('username')[0];
  authorNameElement.textContent = author || 'Anonymous';

  // Listen for likes counts.
  var postRef = firebase.database().ref('posts/' + postId);
  postRef.on('value', function(snapshot) {
    var val = snapshot.val();
    starCount.innerText = val.starCount;
  });

  // Listen for likes.
  postRef.child('stars').on('value', function(snapshot) {
    if (snapshot.hasChild(firebase.auth().currentUser.uid)) {
      unStar.style.display = 'none';
      star.style.display = 'inline-block';
    } else {
      unStar.style.display = 'inline-block';
      star.style.display = 'none';
    }
  });

  // Bind starring action.
  var onStarClicked = function() {
    var globalPostRef = firebase.database().ref('/posts/' + postId);
    var userPostRef = firebase.database().ref('/user-posts/' + firebase.auth().currentUser.uid + '/' + postId);
    toggleStar(globalPostRef, firebase.auth().currentUser.uid);
    toggleStar(userPostRef, firebase.auth().currentUser.uid);
  };
  unStar.addEventListener('click', onStarClicked);
  star.addEventListener('click', onStarClicked);

  return postElement;
}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
  var myUserId = firebase.auth().currentUser.uid;

  var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
  var userPostsRef = firebase.database().ref('user-posts/' + myUserId);

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
        createPostElement(data.key, data.val().title, data.val().body, data.val().author),
        containerElement.firstChild);
    });
    postsRef.on('child_changed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var postElement = containerElement.querySelector('.post[data-id="' + data.key + '"]');
      postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
      postElement.getElementsByClassName('username')[0].innerText = data.val().author;
      postElement.getElementsByClassName('text')[0].innerText = data.val().body;
      postElement.getElementsByClassName('star-count')[0].innerText = data.val().starCount;
    });
    postsRef.on('child_removed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var post = containerElement.querySelector('.post[data-id="' + data.key + '"]');
      post.parentElement.removeChild(post);
    });
  };

  // Fetching and displaying all posts of each sections.
  fetchPosts(recentPostsRef, recentPostsSection);
  fetchPosts(userPostsRef, userPostsSection);

  // Keep track of all Firebase references we are listening to.
  listeningFirebaseRefs.push(recentPostsRef);
  listeningFirebaseRefs.push(userPostsRef);
}

// Bind events
signOutButton.addEventListener('click', function() {
  firebase.auth().signOut();
});

// Listen for auth state changes
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, display the sections
    var userName = user.displayName;
    recentPostsSection.style.display = 'block';
    userPostsSection.style.display = 'block';
    splashPage.style.display = 'none';
    addPost.style.display = 'block';
    startDatabaseQueries();
  } else {
    // No user is signed in, display splash page
    recentPostsSection.style.display = 'none';
    userPostsSection.style.display = 'none';
    splashPage.style.display = 'block';
    addPost.style.display = 'none';
  }
});

messageForm.onsubmit = function(e) {
  e.preventDefault();

  var text = messageInput.value.trim();
  var title = titleInput.value.trim();
  if (text && title) {
    var currentUser = firebase.auth().currentUser;
    writeNewPost(currentUser.uid, currentUser.displayName, currentUser.photoURL, title, text)
      .then(function() {
        messageInput.value = '';
        titleInput.value = '';
      });
  }
};

// Anonymous login
document.getElementById('authAnonymouslyButton').addEventListener('click', function() {
  firebase.auth().signInAnonymously().catch(function(error) {
    console.log(error.message);
  });
});

// Toggle display of sections
recentMenuButton.addEventListener('click', function() {
  recentPostsSection.style.display = 'block';
  userPostsSection.style.display = 'none';
  topUserPostsSection.style.display = 'none';
});

myPostsMenuButton.addEventListener('click', function() {
  recentPostsSection.style.display = 'none';
  userPostsSection.style.display = 'block';
  topUserPostsSection.style.display = 'none';
});

myTopPostsMenuButton.addEventListener('click', function() {
  recentPostsSection.style.display = 'none';
  userPostsSection.style.display = 'none';
  topUserPostsSection.style.display = 'block';
});

addButton.addEventListener('click', function() {
  addPost.style.display = 'block';
});
