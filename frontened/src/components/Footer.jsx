function Footer() {
	return (
		<footer className="footer" id="contact">
			<div className="container footer-grid">
				<div>
					<h4>AI Dropout</h4>
					<p>Prevent Student Dropouts with AI Insights.</p>
				</div>
				<div>
					<h4>Contact</h4>
					<p>support@aidropout.app</p>
					<p>+1 555-0134</p>
				</div>
				<div>
					<h4>Follow</h4>
					<div className="footer-socials">
						<a href="#">Twitter</a>
						<a href="#">LinkedIn</a>
						<a href="#">YouTube</a>
					</div>
				</div>
			</div>
			<div className="container footer-bottom">© {new Date().getFullYear()} AI Dropout</div>
		</footer>
	)
}

export default Footer


