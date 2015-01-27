var serviceURL = 'http://www.kolexinfos.com/prep/services/';

var imageURL = 'images/';

//all the questions returned from the database/json file
var questions = [];


var questionNo = 0;
var totalQuestions = 0;
var indexNo = 0;
var isSubmitted = 0;
var reviewState = 0;

//an array used to track selected answer foreach of the questions
var answerCollection = [];



//an array of the questions the user viewed the answers i.e. clicked submit 
var submittedQuestions = [];

//an array of correctly answered questions
var correctQuestions = [];

////an array of wrongly answered questions
var wrongQuestions = [];

////an array to store all questions from a module
var questionsDummy = [];

//selected category
var selectedCategory = '';

//selected module
var selectedModule = '';

//Algorithm for question range
var rangeQuestion = 0;

//Questions per module
var questionPerModule = 20;

//Datasource for all the whole app
var datasource = 'data.json';

//for cards selected
var selectedCard = '';

//To differentiate between GRE questions and other subjects
var IsGRE = 0;

//To differentiate between ICAN questions and other subjects
var IsICAN = 0;

//ICAN course selected from the list
var selectedCourse = '';

//O'Level Year Selected
 var selectedYear = '';

 var soft = hex_md5("Funnys5140");

//Timer for all modules     
 var myCounter = new Countdown({  
    seconds:3600,  // number of seconds to count down
    onUpdateStatus: function(sec){console.log(sec);updateTimer(sec);}, // callback for each second
    onCounterEnd: function(){ timeup();} // final action
      });

$('#api-popup')
    .hide()  // hide it initially
    .ajaxStart(function() {
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    })
;

     
///////////////////pageinit/////////////////////////////////////////

 // $('#basic_map').on('pageinit', function() {

    $(document).ready( function() {

    //$.mobile.defaultPageTransition   = 'none'
  //  $.mobile.defaultDialogTransition = 'none'
   // $.mobile.buttonMarkup.hoverDelay = 0

   		$('.hover').hover(function(){
                $(this).addClass('flip');
            },function(){
                $(this).removeClass('flip');
            });

         $("#fbLogin").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        //$.mobile.changePage("#modulePage");
         login();
          });      
         

        $("#canvas").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
            }); 

      $("#previous").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        previousClick();
       });


      $("#next").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        nextClick();
        }); 

      $("#finish").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        finishClick()
        }); 

      $("#submitAnswer").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        submitAnswerClick()
        }); 

      $("#more").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        moreClick()
        }); 

      $("#retake").on('click', function(e) {
         console.log("retake working");
        retakeClick();
           });

      $("#review").on('click', function(e) {
        
          reviewClick()
        
         }); 

      $("#learn").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        learnClick()
        }); 

      

      getCategories(); 

      $('#subjectList').on('vclick','li', function(e){
            
            IsGRE = 0;
            IsICAN = 0;
            var category = $(this).attr("category");
            subjectListClick(category);
         });

      $('#icanList').on('vclick','li', function(e){
            IsGRE = 0;
            var category = $(this).attr("category");
            icanListClick(category);
         });

       $('#courseList').on('vclick','li', function(e){
            
            selectedCourse = $(this).attr("course");
            courseListClick();


         });

       $('#yearsList').on('vclick','li', function(e){
            IsICAN = 1;
           selectedYear = $(this).attr("year");

            $.mobile.changePage("#question");

         });


      $('#gmatList').on('vclick','li', function(e){
            IsGRE = 1;
            var category = $(this).attr("category");
            listItemClick(category);
         });


      $('#modules').on('vclick','li', function(e){
        console.log('Module binded');
            e.stopImmediatePropagation();
            e.preventDefault();
           var module = $(this).attr("category");
           moduleClick(module);       
           });

      $('#years').on('vclick','li', function(e){
        console.log('Year Clicked');
            e.stopImmediatePropagation();
            e.preventDefault();
           
           selectedYear = $(this).attr("year");

           $.mobile.changePage("#question");

           });

      $('#cards').on('vclick','li', function(e){
        console.log('ards Module binded');
            e.stopImmediatePropagation();
            e.preventDefault();
           var module = $(this).attr("category");
           selectedCard = module;
           });

      $("#home").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        homeClick()
        }); 

      $("#timer").on('vclick', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        timerClick()
        });

      setInterval(function () {
        connectionStatus = navigator.onLine ? 'online' : 'offline';
        if (connectionStatus != 'online'){
              alert("You need an Internet Connection to make use of this app.");
            }
         else{
            
          }
        }, 100);


     FB.Event.subscribe('auth.login', function(response) {
                               alert('auth.login event');
                               });
            
     FB.Event.subscribe('auth.logout', function(response) {
                               alert('auth.logout event');
                               });
            
      FB.Event.subscribe('auth.sessionChange', function(response) {
                               alert('auth.sessionChange event');
                               });
            
      FB.Event.subscribe('auth.statusChange', function(response) {
                               alert('auth.statusChange event');
                               });

     


      window.onload = function(){

        document.addEventListener("deviceready", onDeviceReady, true);
           }

      

       }) ;

////////////////////////////onDeviceReady()///////////////////////////////////////////////////////
  function onDeviceReady(e){

        if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
            if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
            if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

          try {
          alert('Device is ready! Make sure you set your app_id below this alert.');
         FB.init({ appId: "122921344444754", nativeInterface: CDV.FB, useCachedDialogs: false });
        // getLoginStatus()
         }
          catch (e) {
                  alert(e);
            } 
                  }

/////////////////login()/////////////////////////////////////////////////
   function login() {
                try{
                FB.login(
                         function(response) {
                         if (response.authResponse) {
                          FB.api('/me', function(response) {
                          alert('Good to see you, ' + response.name + '.')  }); }
                         
                           else {
                             alert('not logged in');
                             }
                               },{ scope: "email" }
                         );
              }
              catch(e){
                alert(e);
              }
            }

/////////////////////////////////getLoginStatus()//////////////////////////////////////////////
    function getLoginStatus(){
    FB.getLoginStatus(function(response) {
     
      if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
       FB.api('/me', function(response) {
         alert(response.name);
        });
     } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
    //enable the Login button to allow the user re-authenticate the app
    alert('Not Authroized');

     } else {
    // the user isn't logged in to Facebook.
     //enable the Login button to allow the user login to facebook and re-authenticate the app
     alert('Unknown');

    }
      });

    }



////////////////////question pageshow////////////////////////////////////////
 $('#question').live('pageshow', function() {
          questions = [];
          //var datasource = selectedCategory + '/' + selectedModule + '.json';

        //var datasource = 'data.json';
       
       if(IsGRE == 1){
        $(".someSpinnerImage").show();
        $.getJSON(datasource,function(data){
           
           //totalQuestions = data.questions.length;
           

           $.each(data.questions, function(i, question) {

            if(selectedCategory == question.category){
                  questions.push({
                           quest: question.question,
                           optiona: question.optiona,
                           optionb: question.optionb,
                           optionc: question.optionc,
                           optiond: question.optiond,
                           optione: question.optione,
                           correct: question.correct,
                           explain: question.explain,
                           image: question.image,
                           directions: question.Directions
                                          });
                }

                 $.mobile.loading('hide');
        });

        questions =  questions.slice(rangeQuestion,questionPerModule + rangeQuestion);

        totalQuestions = questions.length;

        kickStart();

         }, { async: false } );

           $(".someSpinnerImage").hide();  
        }

        else if(IsICAN == 1){
          $.getJSON(serviceURL + 'getIcan.php?course='+selectedCategory+'&year='+ selectedYear + '&soft=' + soft,function(data){
           
              $.each(data.questions, function(i, question) {
                questions.push({
                           quest: question.question,
                           optiona: question.optiona,
                           optionb: question.optionb,
                           optionc: question.optionc,
                           optiond: question.optiond,
                           optione: question.optione,
                           correct: question.correct,
                           explain: question.explain,
                           image: question.image,
                           directions: question.Directions
                                          });
              });
              
              totalQuestions = questions.length;
              kickStart();
               

        },  { async: false } );
        }


      else{
       
        $.getJSON(serviceURL + 'getData.php?subject='+selectedCategory+'&year='+ selectedYear + '&soft=' + soft,function(data){
            

              $.each(data.questions, function(i, question) {
                questions.push({
                           quest: question.question,
                           optiona: question.optiona,
                           optionb: question.optionb,
                           optionc: question.optionc,
                           optiond: question.optiond,
                           optione: question.optione,
                           correct: question.correct,
                           explain: question.explain,
                           image: question.image,
                           directions: question.Directions
                                          });
              });
              
              totalQuestions = questions.length;
              kickStart();
              
        },  { async: false } );
      }
      

     
        

  });

////////////////////////////////////////kickStart()//////////////////////////////////
  function kickStart(){
      //Enable all the check box for selecting options
        $("#options input[type='radio']").checkboxradio('enable');
        resetParameters();
        
        indexNo = 0;

        checkSubmitted(indexNo);

        trackAnswered();
         $("#quest").empty();
         $('label[for=optiona]').find('.ui-btn-text').empty();
         $('label[for=optionb]').find('.ui-btn-text').empty();
         $('label[for=optionc]').find('.ui-btn-text').empty();
         $('label[for=optiond]').find('.ui-btn-text').empty();
         $('label[for=optione]').find('.ui-btn-text').empty();

         $("#quest").append(questions[0].quest)
         $('label[for=optiona]').find('.ui-btn-text').append(questions[0].optiona);
         $('label[for=optionb]').find('.ui-btn-text').append(questions[0].optionb);
         $('label[for=optionc]').find('.ui-btn-text').append(questions[0].optionc);
         $('label[for=optiond]').find('.ui-btn-text').append(questions[0].optiond);
         $('label[for=optione]').find('.ui-btn-text').append(questions[0].optione);

         
         questionNo = 1;
         disableButtons();

         //$("#counter").empty();
         //$("#counter").append('Question ' + questionNo+ ' of ' + totalQuestions);
        $("#counter .ui-btn-text").text(""+ questionNo + " of " + totalQuestions);

         setSubject();

         $('#finish').prop('disabled', true).addClass('ui-disabled');
         $('#learn').prop('disabled', true).addClass('ui-disabled'); 
         fillQuestions();


   
    //$('#popupNew').popup({ dismissible: false });
   // $('#popupNew').popup('open');
     startCount();
   }

//////////////////////////setSubject()///////////////////////////////////////////////////
   function setSubject(){
    if(IsGRE == 1){
     $("#subject .ui-btn-text").text(selectedModule + " of "+ selectedCategory);
      }

    else if (IsICAN == 1){
        $("#subject .ui-btn-text").text(selectedCategory + " " + selectedYear);
    }
    else{
       $("#subject .ui-btn-text").text("UME: "+ selectedCategory + " " + selectedYear);
    }
   }


////////////////////home pageshow////////////////////////////////////////
 $('#basic_map').live('pageshow', function() {
      myCounter.stop();
   });


////////////////////modulePage pageshow////////////////////////////////////////
 $('#modulePage').on('pageinit', function(){
     getModules();
 });

////////////////////flashcardPage pageshow////////////////////////////////////////
 $('#flashcardPage').on('pageshow', function(){
    alert("Flash");
 });


//////////////nextClick//////////////////////////////////////////////
 function nextClick(){
  if(reviewState != 1){
  storeSelectedAnswer();}

 //Enable all the check box for selecting options
 $("#options input[type='radio']").checkboxradio('enable');

 //re-enable submit button
 $('#submitAnswer').prop('disabled', false).removeClass('ui-disabled');

 var selectedOption =  $("input[name*=radio-choice-]:checked + label").text();

 //Clear all the questions and options
  $("#quest").empty();
  $('label[for=optiona]').find('.ui-btn-text').empty();
 $('label[for=optionb]').find('.ui-btn-text').empty();
 $('label[for=optionc]').find('.ui-btn-text').empty();
 $('label[for=optiond]').find('.ui-btn-text').empty();
 $('label[for=optione]').find('.ui-btn-text').empty();
 indexNo = indexNo + 1;

  //check if this question has been submitted before
 checkSubmitted(indexNo);
 
 $("#quest").append(questions[indexNo].quest);
 $('label[for=optiona]').find('.ui-btn-text').append(questions[indexNo].optiona);
 $('label[for=optionb]').find('.ui-btn-text').append(questions[indexNo].optionb);
 $('label[for=optionc]').find('.ui-btn-text').append(questions[indexNo].optionc);
 $('label[for=optiond]').find('.ui-btn-text').append(questions[indexNo].optiond);
 $('label[for=optione]').find('.ui-btn-text').append(questions[indexNo].optione);
 

  questionNo = questionNo + 1;
  
  trackAnswered();

  updateCounter();
  disableButtons();

  if(reviewState == 1){
      $('#submitAnswer').prop('disabled', true).addClass('ui-disabled');
      $("#options input[type='radio']").checkboxradio('disable');
      $('#finish').prop('disabled', false).removeClass('ui-disabled');
    }

 }




//////////////previousClick//////////////////////////////////////////////
  function previousClick(){
    if(reviewState != 1){
  storeSelectedAnswer();}
    $("#options input[type='radio']").checkboxradio('enable');
    $('#submitAnswer').prop('disabled', false).removeClass('ui-disabled');


    //Clear all the questions and options
  $("#quest").empty();
  $('label[for=optiona]').find('.ui-btn-text').empty();
 $('label[for=optionb]').find('.ui-btn-text').empty();
 $('label[for=optionc]').find('.ui-btn-text').empty();
 $('label[for=optiond]').find('.ui-btn-text').empty();
 $('label[for=optione]').find('.ui-btn-text').empty();
   questionNo = questionNo - 1;
   indexNo = indexNo - 1;

   //check if this question has been submitted before
 checkSubmitted(indexNo);
 
 $("#quest").append(questions[indexNo].quest)
 $('label[for=optiona]').find('.ui-btn-text').append(questions[indexNo].optiona);
 $('label[for=optionb]').find('.ui-btn-text').append(questions[indexNo].optionb);
 $('label[for=optionc]').find('.ui-btn-text').append(questions[indexNo].optionc);
 $('label[for=optiond]').find('.ui-btn-text').append(questions[indexNo].optiond);
 $('label[for=optione]').find('.ui-btn-text').append(questions[indexNo].optione);
 
 trackAnswered();
 updateCounter();
 disableButtons();

  if(reviewState == 1){
     $('#submitAnswer').prop('disabled', true).addClass('ui-disabled');
     $("#options input[type='radio']").checkboxradio('disable');
     $('#finish').prop('disabled', false).removeClass('ui-disabled');
    }

  }


//////////////finishClick//////////////////////////////////////////////
 function finishClick(){
   
   var right = correctQuestions.length;
   var wrong = wrongQuestions.length;

   $("#correctDetails").empty();
  $("#wrongDetails").empty();
  $("#statusDetails").empty();

  $("#correctDetails").append("Correct Questions : "+ right);
  $("#wrongDetails").append("Wrong Questions : "+ wrong);
  $("#statusDetails").append();

  $( "#showFinish" ).panel( "open" );

  }

///////////////////disableButtons/////////////////////////////////////////
 function disableButtons(){
  
  if(questionNo == totalQuestions){
      $('#next').prop('disabled', true).addClass('ui-disabled');

  }
  else{
    $('#next').prop('disabled', false).removeClass('ui-disabled');
  }

  if(questionNo == 1){
    $('#previous').prop('disabled', true).addClass('ui-disabled');

  }
  else{
     $('#previous').prop('disabled', false).removeClass('ui-disabled');
  }
   
 

  }

//////////////////////updateCounter//////////////////////////////////////
 function updateCounter(){
  //$("#counter").empty();
 // $("#counter").append('Question ' + questionNo+ ' of ' + totalQuestions);

  $("#counter .ui-btn-text").text(" "+ questionNo + " of " + totalQuestions);

  }


//////////////////////startCount//////////////////////////////////////
  function startCount(){
     myCounter.stop(); 
     myCounter.start();
  }


  function Countdown(options) {
  var timer,
  instance = this,
  seconds = options.seconds || 10,
  updateStatus = options.onUpdateStatus || function () {},
  counterEnd = options.onCounterEnd || function () {};

  function decrementCounter() {
    updateStatus(seconds);
    if (seconds === 0) {
      counterEnd();
      instance.stop();
    }
    seconds--;
  }

  this.start = function () {
    clearInterval(timer);
    timer = 0;
    seconds = options.seconds;
    timer = setInterval(decrementCounter, 1000);
  };

  this.stop = function () {
    clearInterval(timer);
  };
 }

 

//////////////////////updateTimer/////////////////////////////////////
 function updateTimer(sec){
  var minute = Math.floor(sec/60) ;
  var ticker = sec%60
  


  //$("#timer").empty();
  //$("#timer").append(minute + ' : ' + ticker);

  $("#timer .ui-btn-text").text("Timer : "+ minute + ":" + ticker);

 
 }

/////////////////////submitAnswerClick/////////////////////////////
 function submitAnswerClick(){
 
 //get the selected option 
 var selectedOption = $("#options :radio:checked").val();

 //get the correct answer
 var correctAnswer = questions[indexNo].correct;

 correctAnswer = correctAnswer.replace("option", "");

 //save submitted question
 submittedQuestions.push(indexNo);


 if(selectedOption == correctAnswer){
    alert("Correct!!! You selected the right response.")
    correctQuestions.push(indexNo);
 }
 else{
    alert("Incorrect. You did not select the correct response. ")
    wrongQuestions.push(indexNo);
 }

 updatePanel();
 $('#learn').prop('disabled', false).removeClass('ui-disabled');
 $('#submitAnswer').prop('disabled', true).addClass('ui-disabled');
 $("#options input[type='radio']").checkboxradio('disable');
 checkFinished();
  }

//////////////////moreClick()////////////////////////////////////
 function moreClick(){
 var imagesrc = serviceURL+imageURL+questions[indexNo].image;
 var instructions = questions[indexNo].directions;
 
 var height = $(window).height();
 var width = $(window).width();

 height = height - 100;
 width = width -100;

 if(questions[indexNo].image == ""){
   if (instructions != ""){
    $("#explanation").empty();
    $("#explanation").append(instructions);
   }
   else{
      $("#explanation").empty();
      $("#explanation").append("No further instruction for this question");
       $('#note').popup('open');

   }
 }
 else{
 $("#questionImage").attr("width",width);
 $("#questionImage").attr("height",height);

 $("#questionImage").attr("src",imagesrc);

 $('#popupImage').popup('open');
  }

  imagesrc = '';
  instructions = '';
  //$("#questionImage").attr("src",imagesrc);

 }



//////////////////checkSubmitted()////////////////////////////////////
 function checkSubmitted(qno){
  //checking index of an array before using it in my code and serving as a break point
 var test = submittedQuestions.indexOf(qno);
 
 if( submittedQuestions.indexOf(qno) > -1 ){
       isSubmitted = 1

 }
 else{
     isSubmitted = 0
 }
 

 }


////////////////////trackAnwsered///////////////////////////////////////////
 function trackAnswered(){
      
      //get the value of the user's selected option before navigating away
      var sel;
      var correctAns = questions[indexNo].correct;
      
  if(answerCollection[indexNo] == null){
     sel = "a";
      }
    else{
       
      sel = answerCollection[indexNo].selected;
    }

 

 if(isSubmitted == 1){

 //deselect any previouly selected from other questions
 $('input[name="radio-choice-1"]').attr('checked', false).checkboxradio( "refresh" );  

 //preselect the previously selected option by user
 $( '#option' + sel ).prop( "checked", false ).checkboxradio( "refresh" ); 
 $( '#option' + sel ).prop( "checked", true ).checkboxradio( "refresh" ); 

 //disable the whole radio control group fieldset
 $("#options input[type='radio']").checkboxradio('disable');

 //disable the submit answer
 $('#submitAnswer').prop('disabled', true).addClass('ui-disabled');

 //enable the learn more button
 $('#learn').prop('disabled', false).removeClass('ui-disabled');
 }
 else{
  //deselect any previouly selected from other questions
  $('input[name="radio-choice-1"]').attr('checked', false).checkboxradio( "refresh" );

  //preselect the previously selected option by user
  $( '#option' + sel ).prop( "checked", false ).checkboxradio( "refresh" ); 
  $( '#option' + sel ).prop( "checked", true ).checkboxradio( "refresh" );

  //disable the learn more button
   $('#learn').prop('disabled', true).addClass('ui-disabled');

  //enable the submit answer
 $('#submitAnswer').prop('disabled', false).removeClass('ui-disabled'); 
 }

 if(reviewState == 1){
  
  darkenOptions();

  $( '#' + correctAns ).prop( "checked", true ).checkboxradio( "refresh" ); 
  
  //Paint the selected answer red
  $('label[for=option'+ sel + ']').find('.ui-btn-text').css( "color", "red" );

  //Paint the selected answer green
  $('label[for='+ correctAns + ']').find('.ui-btn-text').css( "color", "green" );
 }

   }

////////////////////storeSelectedAnswer////////////////////////////////////////////////////
 function storeSelectedAnswer(){

  //get the selected option 
 var selectedOption = $("#options :radio:checked").val();

  answerCollection[indexNo] = {selected : selectedOption};



 }

/////////////////////updatePanel///////////////////////////
 function updatePanel(){

  $("#questDetails").empty();
  $("#answerDetails").empty();
  $("#explainDetails").empty();

 var questionText = questions[indexNo].quest;
 var correctText = questions[indexNo].correct;
 var explain = questions[indexNo].explain;

  correctText =   correctText.replace("option","");
  correctText = correctText.toUpperCase();

 $("#questDetails").append("Question : " + questionText);
 $("#answerDetails").append("Correct Answer : " + correctText);
 $("#explainDetails").append("Learn More :"+ explain);

  //$( "#showDetails" ).panel( "open" );
  $('#showDetails').popup('open');

 }


/////////////learnClick//////////////////////////////////////////////////////////////////
 function learnClick(){

  updatePanel();
 }

///////////////////////////fillQuestions//////////////////////////////////////////////
 function fillQuestions(){
  for (i=1; i<=totalQuestions; i++)
   {
      questionsDummy.push(i);
   }
 
 }


///////////////////////////retakeClick///////////////////////////////
 function retakeClick(){

  indexNo = -1;
  
  resetParameters()

  nextClick();

  startCount();

 }

///////////////////////////reviewClick///////////////////////////////
 function reviewClick(){
   indexNo = -1;
   questionNo = 0;
   reviewState = 1;

   nextClick();

  }

//////////////////////////darkenOptions////////////////////////////

 function darkenOptions(){
  $('label[for=optiona]').find('.ui-btn-text').css( "color", "black" );
  $('label[for=optionb]').find('.ui-btn-text').css( "color", "black" );
  $('label[for=optionc]').find('.ui-btn-text').css( "color", "black" );
  $('label[for=optiond]').find('.ui-btn-text').css( "color", "black" );
  $('label[for=optione]').find('.ui-btn-text').css( "color", "black" );

 }


///////////////////////////checkFinished////////////////////////////////////////////////////////////
  function checkFinished(){

    if(submittedQuestions.length == totalQuestions) {
        $('#finish').prop('disabled', false).removeClass('ui-disabled');
    }
    else{
      $('#finish').prop('disabled', true).addClass('ui-disabled');
    }  
  }


/////////////////////getCategories//////////////////////////////////////////
 /*getCategories: Returns all the categories from the json file 
 Source: http://stackoverflow.com/questions/517519/how-to-get-distinct-values-from-json-in-jquery */
  function getCategories(){

    var output = '';

    var arr = new Array();
    
    $.getJSON(datasource,function(data){ 
        
        $.each(data.questions, function(i,question){

          if (jQuery.inArray(question.category, arr) === -1) {        
    output += '<li category="'+ question.category + '"><a href="listings.html?category=' + question.category + '">' + question.category + '</a></li>';
     arr.push(question.category);
             }
        });
        $("#listItem").append(output).listview("refresh");
      });

    
  }

//////////////////////////getModules()//////////////////////////////////////////////////////////////////////
 function getModules(){
  var output = '';
    
    $.getJSON("modules/modules.json",function(data){ 
        
        $.each(data.categories, function(i,category){
        
      output += '<li category="'+ category.name + '"><a href="listings.html?category=' + category.name + '">' + category.name + '</a></li>';
    
        });
        $("#modules").append(output).listview("refresh");
      });
 }


////////////////////////// listItemClick()///////////////////////////////////////////////////
 function  listItemClick(category){
  
    //$.mobile.changePage("#modulePage");
    selectedCategory = category;
  }

///////////////////////////////////subjectListClick()////////////////////////////////////////////////
 function  subjectListClick(category){
  
    selectedCategory = category;
   

  $('#years li').remove();
  
  $.getJSON(serviceURL + 'getYears.php?category='+ selectedCategory, function(data){
      $.each(data.years, function(index, value){
            var output = '';
      output += '<li year=' + value.year +' >' + value.year + '</a></li>';

            $("#years").append(output).listview("refresh");
          });
    });

  }

////////////////////////////////////icanListClick()///////////////////////////////////////
   function icanListClick(category){
      selectedCategory = category;

      $('#courseList li').remove();

      $.getJSON(serviceURL + 'icanCourses.php?category='+ selectedCategory, function(data){
      $.each(data.courses, function(index, value){
            var output = '';
      output += '<li course="' + value.course +'" ><a href="#icanYears" data-rel="popup" data-position-to="window">' + value.course + '</a></li>';

            $("#courseList").append(output).listview("refresh");
          });
    });

    }
//////////////////////////////////courseListClick()////////////////////////////////////////////////////////
    function courseListClick(){
        selectedCategory = selectedCourse;
       $('#yearsList li').remove();

       $.getJSON(serviceURL + 'icanYears.php?course='+ selectedCourse, function(data){
      $.each(data.years, function(index, value){
            var output = '';
      output += '<li year=' + value.year +' >' + value.year + '</a></li>';

            $("#yearsList").append(output).listview("refresh");
          });
    });
     
    // $('#icanCourses').popup('close');
    // $('#icanYears').popup("open");
    }

//////////////////////moduleClick/////////////////////////////////////////////////////////////////////////

 function moduleClick(module)
 {
 //   if(module == 'Module 1'){
   
 //   selectedModule = module;
 //   $.mobile.changePage("#question");
 // }
 // else{
 //  alert("Only Module 1 is available for Evaluation Copy");
 // }

 selectedModule = module;
 switch(module)
 {
  case 'Module 1':
    rangeQuestion = 0
    $.mobile.changePage("#question");
    break;
  case 'Module 2':
    rangeQuestion = 20
    $.mobile.changePage("#question");
    break;
  case 'Module 3':
   rangeQuestion = 40
    $.mobile.changePage("#question");
  break;
  case 'Module 4':
   rangeQuestion = 60
    $.mobile.changePage("#question");
  break;
  case 'Module 5':
   rangeQuestion = 80
    $.mobile.changePage("#question");
  break;
  case 'Module 6':
   rangeQuestion = 100
    $.mobile.changePage("#question");
  break;
  case 'Module 7':
   rangeQuestion = 120
    $.mobile.changePage("#question");
  break;
  case 'Module 8':
   rangeQuestion = 140
    $.mobile.changePage("#question");
  break;
  case 'Module 9':
   rangeQuestion = 160
    $.mobile.changePage("#question");
  break;
  case 'Module 10':
   rangeQuestion = 180
    $.mobile.changePage("#question");
  break;

  default:
    alert("Something went wrong");
  }


 }

////////////////////////resetParameters////////////////////////////////////////////////////////////////
 function resetParameters(){
  questionNo = 0;
  reviewState = 0;

  answerCollection = [];

  submittedQuestions = [];

  correctQuestions = [];

  wrongQuestions = [];

  darkenOptions();

  checkFinished();

  checkSubmitted();

 }

////////////////////homeClick()//////////////////////////////////////////////////////////////////////
  function homeClick(){
    myCounter.stop();
    resetParameters();
    $.mobile.changePage("#basic_map");

  }


//////////////////////////timerClick////////////////////////////////////////////////////
  function timerClick(){

   $('#popupNew').popup('open');
  }


//////////////Comments//////////////////////////////////////////////
 //$('label[for=optiona]').text('best option');
        //$("#optiona").attr("checked",true).checkboxradio("refresh");
        //.find('.ui-btn-text')

///////////////////////downloadFile/////////////////////////////////////
 /*http://stackoverflow.com/questions/6417055
 /download-files-and-store-them-locally-with-phonegap-jquery-mobile-android-and-io*/
  function downloadFile(){

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
    function onFileSystemSuccess(fileSystem) {
        fileSystem.root.getFile(
        "dummy.html", {create: true, exclusive: false}, 
        function gotFileEntry(fileEntry) {
            var sPath = fileEntry.fullPath.replace("dummy.html","");
            var fileTransfer = new FileTransfer();
            fileEntry.remove();

            fileTransfer.download(
                "http://www.w3.org/2011/web-apps-ws/papers/Nitobi.pdf",
                sPath + "theFile.pdf",
                function(theFile) {
                    console.log("download complete: " + theFile.toURI());
                    showLink(theFile.toURI());
                },
                function(error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("upload error code: " + error.code);
                }
            );
        }, fail);
    }, fail);
   };
 function fail(error) { console.log(error.code); }


/////////////////////////////////////timeup()/////////////////////////////////////////////////
  function timeup(){

        alert('Test Time Elapsed!');

        finishClick();
  }

