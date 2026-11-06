
const APP_STORAGE_KEY = 'sharetots_posts';
const USER_STORAGE_KEY = 'sharetots_user';
const USERS_STORAGE_KEY = 'sharetots_all_users';
const THEME_STORAGE_KEY = 'sharetots_theme';

const state = {
    currentUser: JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || null,
    posts: JSON.parse(localStorage.getItem(APP_STORAGE_KEY)) || [],
    isLoginMode: false,
    selectedFileData: null,
    activeCommentPostId: null,
    people: [
        { name: 'Mila Chen', handle: '@mila', status: 'online', note: 'Designing calm spaces' },
        { name: 'Jude Park', handle: '@jude', status: 'online', note: 'Late-night sketching' },
        { name: 'Naya Ross', handle: '@naya', status: 'online', note: 'Coffee and content' },
        { name: 'Luca Smith', handle: '@luca', status: 'online', note: 'Editing fresh reels' },
        { name: 'Ari Blake', handle: '@ari', status: 'online', note: 'Launching a zine' },
        { name: 'Rina Sol', handle: '@rina', status: 'online', note: 'Sunset photography' }
    ]
};

const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authToggle = document.getElementById('auth-toggle');
const authToggleWrapper = document.getElementById('auth-toggle-wrapper');
const logoutBtn = document.getElementById('logout-btn');
const themeToggle = document.getElementById('theme-toggle');
const fileInput = document.getElementById('file-input');
const filePreviewTxt = document.getElementById('file-preview-txt');
const createPostForm = document.getElementById('create-post-form');
const postsStream = document.getElementById('posts-stream');
const commentsPanel = document.getElementById('comments-panel');
const settingsModal = document.getElementById('settings-modal');
const darkModeSetting = document.getElementById('dark-mode-setting');
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const toast = document.getElementById('toast');

initialize();

function initialize() {
    initTheme();
    bindGlobalEvents();
    checkAuthStatus();
    renderSidePeople();
    renderPosts();
    renderCommentsPanel();
    setupSecurity();
}

function bindGlobalEvents() {
    themeToggle.addEventListener('click', toggleTheme);
    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    settingsModal.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });
    saveSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
        showToast('Settings saved');
    });
    darkModeSetting.addEventListener('change', () => {
        const nextTheme = darkModeSetting.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        themeToggle.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
    });

    authToggle.addEventListener('click', () => {
        state.isLoginMode = !state.isLoginMode;
        renderAuthState();
    });

    authForm.addEventListener('submit', handleAuthSubmit);
    logoutBtn.addEventListener('click', handleLogout);
    fileInput.addEventListener('change', handleFileSelection);
    createPostForm.addEventListener('submit', handleCreatePost);

    postsStream.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;

        const postId = button.dataset.postId;
        const action = button.dataset.action;

        switch (action) {
            case 'like':
                toggleLike(postId);
                break;
            case 'repost':
                triggerRepost(postId);
                break;
            case 'share':
                copyDeepLink(postId);
                break;
            case 'comments':
                state.activeCommentPostId = postId;
                renderCommentsPanel();
                renderPosts();
                break;
            case 'edit':
                startEditPost(postId);
                break;
            case 'save-edit':
                saveEditedPost(postId, button.closest('.edit-form'));
                break;
            case 'cancel-edit':
                renderPosts();
                break;
            case 'delete':
                deletePost(postId);
                break;
            case 'follow':
                showToast(`Follow request sent to ${button.dataset.user}`);
                break;
            default:
                break;
        }
    });

    postsStream.addEventListener('submit', (event) => {
        const form = event.target.closest('.comment-form');
        if (!form) return;
        event.preventDefault();
        const postId = form.dataset.postId;
        const input = form.querySelector('.comment-input');
        const commentText = input.value.trim();
        if (!commentText || !state.currentUser) {
            if (!state.currentUser) showToast('Please log in to comment.');
            return;
        }

        const post = state.posts.find((item) => item.id === postId);
        if (!post) return;

        post.comments.push({
            username: state.currentUser.username,
            text: commentText
        });

        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state.posts));
        state.activeCommentPostId = postId;
        form.reset();
        renderPosts();
        renderCommentsPanel();
    });

    document.addEventListener('submit', (event) => {
        const sideForm = event.target.closest('#side-comment-form');
        if (!sideForm) return;
        event.preventDefault();
        if (!state.currentUser) {
            showToast('Please log in to comment.');
            return;
        }
        const post = state.posts.find((item) => item.id === state.activeCommentPostId);
        if (!post) return;
        const input = sideForm.querySelector('#side-comment-input');
        const commentText = input.value.trim();
        if (!commentText) return;
        post.comments.push({
            username: state.currentUser.username,
            text: commentText
        });
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state.posts));
        input.value = '';
        renderPosts();
        renderCommentsPanel();
    });

    document.getElementById('home-btn').addEventListener('click', showFeed);
}

function renderAuthState() {
    if (state.isLoginMode) {
        authTitle.textContent = 'Welcome Back';
        authSubmitBtn.textContent = 'Log In';
        authToggleWrapper.innerHTML = `Don't have an account? <span id="auth-toggle">Sign Up</span>`;
    } else {
        authTitle.textContent = 'Welcome to ShareTots';
        authSubmitBtn.textContent = 'Sign Up';
        authToggleWrapper.innerHTML = `Already have an account? <span id="auth-toggle">Log In</span>`;
    }
    document.getElementById('auth-toggle').addEventListener('click', () => {
        state.isLoginMode = !state.isLoginMode;
        renderAuthState();
    });
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    darkModeSetting.checked = savedTheme === 'dark';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    themeToggle.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
    darkModeSetting.checked = nextTheme === 'dark';
}

function setupSecurity() {
    document.addEventListener('contextmenu', (event) => event.preventDefault());
    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'F12' ||
            (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) ||
            (event.ctrlKey && event.key === 'u')
        ) {
            event.preventDefault();
        }
    });
}

function handleAuthSubmit(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('auth-username').value.trim();
    const passwordInput = document.getElementById('auth-password').value;

    if (!usernameInput || !passwordInput) return;

    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];

    if (state.isLoginMode) {
        const user = users.find((entry) => entry.username.toLowerCase() === usernameInput.toLowerCase() && entry.password === passwordInput);
        if (!user) {
            showToast('Invalid credentials, try again.');
            return;
        }
        state.currentUser = user;
    } else {
        const exists = users.some((entry) => entry.username.toLowerCase() === usernameInput.toLowerCase());
        if (exists) {
            showToast('Username is already taken.');
            return;
        }
        state.currentUser = { username: usernameInput, password: passwordInput };
        users.push(state.currentUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state.currentUser));
    authForm.reset();
    checkAuthStatus();
}

function handleLogout() {
    state.currentUser = null;
    localStorage.removeItem(USER_STORAGE_KEY);
    checkAuthStatus();
}

function checkAuthStatus() {
    if (state.currentUser) {
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        const initials = state.currentUser.username.charAt(0).toUpperCase();
        document.getElementById('current-username').textContent = `@${state.currentUser.username}`;
        document.getElementById('current-user-avatar').textContent = initials;
        document.getElementById('composer-avatar').textContent = initials;
    } else {
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
        logoutBtn.classList.add('hidden');
    }
}

function handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) {
        state.selectedFileData = null;
        filePreviewTxt.style.display = 'none';
        filePreviewTxt.textContent = '';
        return;
    }

    filePreviewTxt.textContent = `Selected: ${file.name}`;
    filePreviewTxt.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function (loadEvent) {
        state.selectedFileData = {
            name: file.name,
            type: file.type,
            dataUrl: loadEvent.target.result
        };
    };
    reader.readAsDataURL(file);
}

function handleCreatePost(event) {
    event.preventDefault();
    if (!state.currentUser) {
        showToast('Please log in to post.');
        return;
    }

    const text = document.getElementById('post-text').value.trim();
    if (!text && !state.selectedFileData) return;

    const newPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        username: state.currentUser.username,
        text,
        file: state.selectedFileData,
        timestamp: new Date().toLocaleString(),
        likes: [],
        reposts: 0,
        comments: []
    };

    state.posts.unshift(newPost);
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state.posts));

    createPostForm.reset();
    state.selectedFileData = null;
    filePreviewTxt.style.display = 'none';
    filePreviewTxt.textContent = '';
    renderPosts();
    renderCommentsPanel();
}

function renderPosts() {
    postsStream.innerHTML = '';

    if (state.posts.length === 0) {
        postsStream.innerHTML = '<div class="empty-feed">The timeline is quiet. Be the first to share something meaningful.</div>';
        return;
    }

    state.posts.forEach((post) => {
        const isLiked = state.currentUser && post.likes.includes(state.currentUser.username);
        const postCard = document.createElement('div');
        postCard.className = `post-card ${state.activeCommentPostId === post.id ? 'active-comment' : ''}`;
        postCard.dataset.postId = post.id;

        let mediaHtml = '';
        if (post.file) {
            if (post.file.type.startsWith('image/')) {
                mediaHtml = `<img src="${post.file.dataUrl}" class="post-media" alt="Shared media">`;
            } else if (post.file.type.startsWith('video/')) {
                mediaHtml = `<video src="${post.file.dataUrl}" class="post-media" controls></video>`;
            } else if (post.file.type.startsWith('audio/')) {
                mediaHtml = `<audio src="${post.file.dataUrl}" controls style="width:100%; margin-bottom:0.8rem;"></audio>`;
            } else {
                mediaHtml = `<a href="${post.file.dataUrl}" class="soft-btn dm-btn" download="${post.file.name}" style="display:inline-flex; margin-bottom:0.8rem;">📄 ${post.file.name}</a>`;
            }
        }

        const commentsPreview = post.comments.slice(-2).map((comment) => `
            <div class="comment-item">
                <span class="comment-user">@${escapeHtml(comment.username)}:</span>
                <span class="comment-text">${escapeHtml(comment.text)}</span>
            </div>
        `).join('');

        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-meta">
                    <div class="avatar">${post.username.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="post-user">@${escapeHtml(post.username)}</div>
                    </div>
                </div>
                <span class="post-time">${post.timestamp}</span>
            </div>

            <div class="post-copy">${escapeHtml(post.text)}</div>
            ${mediaHtml}

            <div class="post-stats">
                <span>${post.likes.length} likes</span>
                <span>${post.comments.length} comments</span>
            </div>

            <div class="post-actions-row">
                <button type="button" class="soft-btn ${isLiked ? 'active' : ''}" data-action="like" data-post-id="${post.id}">${isLiked ? '♥ Liked' : '♡ Like'}</button>
                <button type="button" class="soft-btn" data-action="comments" data-post-id="${post.id}">💬 Comment</button>
                <button type="button" class="soft-btn" data-action="repost" data-post-id="${post.id}">↻ Repost</button>
                <button type="button" class="soft-btn" data-action="share" data-post-id="${post.id}">↗ Share</button>
            </div>

            <div class="post-actions-row">
                <button type="button" class="ghost-btn" data-action="edit" data-post-id="${post.id}">Edit</button>
                <button type="button" class="ghost-btn" data-action="delete" data-post-id="${post.id}">Delete</button>
            </div>

            <form class="comment-form" data-post-id="${post.id}">
                <input type="text" class="comment-input" name="comment" placeholder="Write a cool comment..." required>
                <button type="submit" class="btn-primary comment-submit">Send</button>
            </form>

            <div class="comment-list">
                ${commentsPreview || '<div class="thread-empty">No comments yet. Be the first to say something.</div>'}
            </div>
        `;

        postsStream.appendChild(postCard);
    });
}

function startEditPost(postId) {
    const post = state.posts.find((item) => item.id === postId);
    if (!post) return;

    const card = postsStream.querySelector(`[data-post-id="${postId}"]`);
    if (!card) return;

    card.innerHTML = `
        <div class="post-header">
            <div class="post-meta">
                <div class="avatar">${post.username.charAt(0).toUpperCase()}</div>
                <div>
                    <div class="post-user">@${escapeHtml(post.username)}</div>
                </div>
            </div>
            <span class="post-time">${post.timestamp}</span>
        </div>
        <form class="edit-form" data-post-id="${post.id}">
            <textarea aria-label="Edit post">${escapeHtml(post.text)}</textarea>
            <div class="edit-actions">
                <button type="button" class="ghost-btn" data-action="cancel-edit" data-post-id="${post.id}">Cancel</button>
                <button type="button" class="btn-primary" data-action="save-edit" data-post-id="${post.id}">Save</button>
            </div>
        </form>
    `;
}

function saveEditedPost(postId, form) {
    const post = state.posts.find((item) => item.id === postId);
    if (!post) return;

    const textarea = form ? form.querySelector('textarea') : null;
    const updatedText = textarea ? textarea.value.trim() : '';

    if (!updatedText) {
        showToast('Post cannot be empty.');
        return;
    }

    post.text = updatedText;
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state.posts));
    renderPosts();
    renderCommentsPanel();
}

function deletePost(postId) {
    const post = state.posts.find((item) => item.id === postId);
    if (!post) return;

    const isMine = state.currentUser && post.username === state.currentUser.username;
    if (!isMine) {
        showToast('Only the author can delete this post.');
        return;
    }

    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) return;

    state.posts = state.posts.filter((item) => item.id !== postId);
    if (state.activeCommentPostId === postId) {
        state.activeCommentPostId = null;
    }
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state.posts));
    renderPosts();
    renderCommentsPanel();
}

function toggleLike(postId) {
    if (!state.currentUser) {
        showToast('Please log in to like posts.');
        return;
    }

    const post = state.posts.find((item) => item.id === postId);
    if (!post) return;

    const userIndex = post.likes.indexOf(state.currentUser.username);
    if (userIndex >= 0) {
        post.likes.splice(userIndex, 1);
    } else {
        post.likes.push(state.currentUser.username);
    }

    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state.posts));
    renderPosts();
}

function triggerRepost(postId) {
    if (!state.currentUser) {
        showToast('Please log in to repost.');
        return;
    }

    const post = state.posts.find((item) => item.id === postId);
    if (!post) return;

    post.reposts += 1;
    const repostEntry = {
        id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        username: state.currentUser.username,
        text: `🔁 Reposted from @${post.username}:\n\n${post.text}`,
        file: post.file,
        timestamp: new Date().toLocaleString(),
        likes: [],
        reposts: 0,
        comments: []
    };

    state.posts.unshift(repostEntry);
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state.posts));
    renderPosts();
    renderCommentsPanel();
}

function copyDeepLink(postId) {
    const deepLink = `${window.location.origin}${window.location.pathname}?post=${postId}`;
    navigator.clipboard.writeText(deepLink)
        .then(() => showToast('Link copied to clipboard'))
        .catch(() => showToast('Copy failed for this browser'));
}

function renderCommentsPanel() {
    if (!state.activeCommentPostId) {
        commentsPanel.innerHTML = `
            <div class="comments-header">
                <h3>Comments</h3>
                <span class="count-badge">0</span>
            </div>
            <div class="thread-empty">Choose a post to view the conversation.</div>
        `;
        return;
    }

    const selectedPost = state.posts.find((post) => post.id === state.activeCommentPostId);
    if (!selectedPost) {
        state.activeCommentPostId = null;
        renderCommentsPanel();
        return;
    }

    const commentItems = selectedPost.comments.length
        ? selectedPost.comments.map((comment) => `
            <div class="comment-item">
                <span class="comment-user">@${escapeHtml(comment.username)}</span>
                <span class="comment-text">${escapeHtml(comment.text)}</span>
            </div>
        `).join('')
        : '<div class="thread-empty">No comments yet. Start the conversation.</div>';

    commentsPanel.innerHTML = `
        <div class="comments-header">
            <h3>Comments</h3>
            <span class="count-badge">${selectedPost.comments.length}</span>
        </div>
        <div class="comment-thread">
            ${commentItems}
        </div>
        <form id="side-comment-form" class="panel-comment-form">
            <input id="side-comment-input" type="text" class="comment-input" placeholder="Add your reply..." required>
            <button type="submit" class="btn-primary">Send</button>
        </form>
    `;
}

function renderSidePeople() {
    const onlineList = document.getElementById('online-people');
    const recommendedList = document.getElementById('recommended-people');

    onlineList.innerHTML = state.people.slice(0, 4).map((person) => `
        <div class="person-row">
            <div class="person-meta">
                <div class="avatar">${person.name.charAt(0)}</div>
                <div class="person-copy">
                    <strong>${person.name}</strong>
                    <span>${person.note}</span>
                </div>
            </div>
            <span class="pill soft-green">${person.status}</span>
        </div>
    `).join('');

    recommendedList.innerHTML = state.people.slice(4).map((person) => `
        <div class="person-row">
            <div class="person-meta">
                <div class="avatar">${person.name.charAt(0)}</div>
                <div class="person-copy">
                    <strong>${person.handle}</strong>
                    <span>${person.note}</span>
                </div>
            </div>
            <button type="button" class="mini-btn" data-action="follow" data-user="${person.name}">Add</button>
        </div>
    `).join('');
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => toast.classList.remove('show'), 1800);
}

function showFeed() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
