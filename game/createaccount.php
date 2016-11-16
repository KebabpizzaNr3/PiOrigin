
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

      var createCharacter = function(name){
        return $.ajax({
          url: "http://localhost:8000/api/charcreate",
          method: 'POST',
          data: {Charname: name}
        });
      };

      var createUser = function(username, password, character){
        var id = character[2].responseJSON.charId;
        $.ajax({
          url: "http://localhost:8000/api/signup",
          method: 'POST',
          data: {Username: username, Password: password, CharacterId: id},
          success: function() {
            window.location.replace("login.php");
          }
        });
      };

      function clickedcreate(){
        var user = document.getElementById('inputUsername').value;
        var pass = document.getElementById('inputPassword').value;
        var passcheck = document.getElementById('inputPasswordCheck').value;
        var charactername = document.getElementById('characterName').value;

        if(pass!=passcheck)
        {
          window.alert("passwords does not match");
        }

        else {

          $(function(){
            $("form").submit(function(e){
              e.preventDefault();
              $.when(user, pass, createCharacter(charactername)).then(createUser);
            });
          });
        }
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

       <div class="row">
         <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>
         <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <form class="form-signin">
              <h2 class="form-signin-heading">Enter details</h2>
              <label for="inputUsername" class="sr-only">Username</label>
              <input type="user" id="inputUsername" class="form-control" placeholder="Username"required autofocus >
              <label for="inputPassword" class="sr-only">Password</label>
              <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
              <label for="inputPassword" class="sr-only">Passwordcheck</label>
              <input type="password" id="inputPasswordCheck" class="form-control" placeholder="Type password again"required>

              <input type="text" id="characterName" class="form-control" placeholder="Type character name here"required>

              <button type="submit" class="btn btn-primary" onclick="clickedcreate()">Create</button>


            </form>

        </div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"></div>
    </div> <!-- /container -->

    <script>

    </script>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="../style/bootstrap-3.3.6/dist/js/bootstrap.js"></script>
  </body>
</html>
