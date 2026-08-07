<!-- FOOTER -->
<footer class="site-footer">
  <div class="footer-top">

    <div class="footer-brand">
      <div class="fb-logo">
        <img src="../images/logo.png" alt="SBFC Logo">
        <span class="fb-name">SBFC Organization</span>
      </div>
      <p>Dedicated to building stronger communities and empowering lives since 1998. Together we make a difference.</p>
      <div class="footer-social">
        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
      </div>
    </div>

    <div class="footer-col">
      <h5>Quick Links</h5>
      <ul>
        <li><a href="../index.php">Home</a></li>
        <li><a href="../gallery.php">Gallery</a></li>
        <li><a href="../history.php">History</a></li>
        <li><a href="../founder.php">Founders</a></li>
        <li><a href="../contact.php">Contact</a></li>
        <li><a href="../about.php">About Us</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h5>Our Mission</h5>
      <ul>
        <li><a href="../give.php">Make a Donation</a></li>
        <li><a href="../history.php">Our Journey</a></li>
        <li><a href="../about.php">Impact Report</a></li>
        <li><a href="../contact.php">Volunteer</a></li>
        <li><a href="../contact.php">Partnerships</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h5>Contact Info</h5>
      <div class="fc-contact-item"><i class="fas fa-map-marker-alt"></i> 114/2 Hazi Solimullah Road, Dhaka-1204, Bangladesh</div>
      <div class="fc-contact-item"><i class="fas fa-phone-alt"></i> +880 199 250 0204</div>
      <div class="fc-contact-item"><i class="fas fa-envelope"></i> sbfcorgs@gmail.com</div>
    </div>

  </div>

  <div class="footer-bottom">
    <span>&copy; <?php echo date("Y"); ?> SBFC Organization. All Rights Reserved.</span>
    <span>Built with <span style="color:#ef4444">&#9829;</span> for Humanity</span>
  </div>
</footer>

<script>
// Banner Guardian — runs after ALL scripts including InfinityFree injections
window.addEventListener('load', function() {
  setTimeout(function() {
    var hero = document.querySelector('.sbfc-hero');
    if (hero) {
      hero.style.cssText = 'min-height:100vh!important;display:grid!important;grid-template-columns:1fr 1.4fr!important;gap:40px!important;align-items:center!important;padding:120px 6% 80px!important;position:relative!important;overflow:hidden!important;background:linear-gradient(160deg,#0d1f17 0%,#12381f 50%,#0d1f17 100%)!important;';
    }
    var banner = document.querySelector('.sbfc-banner');
    if (banner) {
      banner.style.cssText = 'position:relative!important;z-index:1!important;display:block!important;visibility:visible!important;opacity:1!important;';
    }
  }, 100);
});
</script>

</body>
</html>
