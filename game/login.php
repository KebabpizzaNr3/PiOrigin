
<!DOCTYPE html>
<html>
  <head>

    <meta charset="utf-8">
    <link rel="stylesheet/less" type="text/css" href="../style/style.less">
    <style>
      body{
        background-color:  #4EC5ED;
        }
      </style>

    <script src="../js/less.min.js"></script>
    <script src="js/libs/jquery-1.12.3.js"></script>


    <script type="text/javascript">

      var setCookie = function(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires;
    };



      function clicked(){
        var user = document.getElementById('inputUsername');
        var pass = document.getElementById('inputPassword');


        $(function(){
          $("form").submit(function(e){
              e.preventDefault();
              $.ajax({
                url: "http://localhost:8000/api/login",
                method: 'POST',
                data: {Username: user.value, Password: pass.value}
                  }).done(function(result) {
                console.log(result);
                setCookie('login', result.token, 4);
                window.location.replace("index.php");
                  }).fail(function(err) {
                throw err;
              });
            });
        });

        //Send login-details to the server and let the server check the database if the put in values are correct.

        // 3 types of messages can be recieved from the server.
        // 1. The user does not exists.
        // 2. The user exist but the password is Incorrect
        // 3. The values are correct and all the information needed to start the gameclient will be recieved from the server and the game will launch.


      }
    </script>

    <title>Pokemon</title>
  </head>
  <body>

     <div class="fluid-container">

       <div class="row">
         <div class="col-xs-0 col-sm-1 col-md-3 col-lg-3"></div>
         <div class="col-xs-9 col-sm-7 col-md-6 col-lg-5">
         <img src="assets/img/headerimg.png" id="bild1" alt="Welcomepic" style="width:913px;height:275px;">
         </div>
         <div class="col-xs-3 col-sm-3 col-md-3 col-lg-4"></div>
     </div>

     <div class="container">

       <div class="row">
         <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"></div>
         <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <form class="form-signin">
              <h2 class="form-signin-heading">Please sign in</h2>
              <label for="inputUsername" class="sr-only">Username</label>
              <input type="user" id="inputUsername" class="form-control" placeholder="Username" required autofocus >
              <label for="inputPassword" class="sr-only">Password</label>
              <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
              <div class="checkbox">
                <label>
                  <input type="checkbox" value="remember-me"> Remember me
                </label>
              </div>
              <button class="btn btn-lg btn-primary btn-block" type="submit" onclick="clicked()">Sign in </button>
              <a class="btn btn-large btn-info" href="createaccount.php">Create new account</a>


            </form>

        </div>
        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"></div>



    </div> <!-- /container -->

    <script>

    </script>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="<?=$dir?>../style/bootstrap-3.3.6/dist/js/bootstrap.js"></script>
  </body>
</html>
