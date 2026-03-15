function readMore() {
    alert("Full travel story coming soon!");
}

function scrollToPosts() {
    document.getElementById("posts").scrollIntoView({
        behavior: "smooth"
    });
}

function openModal(title, desc, imgSrc) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalStory").innerHTML = `<p>${desc}</p><p>Imagine standing there right now — the air, the sounds, the feeling of being exactly where you're meant to be. What's stopping you?</p>`;
    document.getElementById("modalImage").src = imgSrc;
    document.getElementById("destModal").style.display = "block";
}

function closeModal() {
    document.getElementById("destModal").style.display = "none";
}

// Close modal when clicking outside content
window.onclick = function(event) {
    const modal = document.getElementById("destModal");
    if (event.target === modal) {
        closeModal();
    }
}
