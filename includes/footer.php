<!-- <footer id='footer'>
<p>Copy &copy; Fantastic Five 2016</p>

</footer> -->

<script src="<?=$dir?>js/jquery.js"></script>
<!--Bootstrap Includes-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="<?=$dir?>style/bootstrap-3.3.6/dist/js/bootstrap.js"></script>


<!-- Menu Toggle Script -->
  <script>
  $("#menu-close").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });

    // Opens the sidebar menu
    $("#menu-toggle").click(function(e) {
        e.preventDefault();

    $("#sidebar-wrapper").toggleClass("active");
    });



  </script>
</body>
</html>
