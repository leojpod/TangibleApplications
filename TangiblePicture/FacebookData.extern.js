/**
 * Constructor
 * (FBDataadapter grabs friends information from the Facebook's friend list of 
 *	the user. It takes Facebook credentials of the user and dumbs
 *	user data. Further this data can be used by other component's to create new apps.)
 *
 * @param id The components identity ? a String parameter that may 
 * be assumed to be unique to the particular instance being created.
 * @param env  The components environment ? a struct providing the functions 
 * of other components that this instance may need to invoke.
 */


function make_FacebookData(id, env) {
   container_div = document.getElementById(id);
    fbbtn=document.createElement("input");
    fbbtn.setAttribute("type", "button");
    fbbtn.setAttribute("id", "fb-auth");
    fbbtn.setAttribute("value", "Facebook Login");
    container_div.appendChild(fbbtn);
    
    fb=document.createElement("div");
    fb.setAttribute("id", "fb-root");
    container_div.appendChild(fb);
    
    loaderDiv=document.createElement("div");
    loaderDiv.setAttribute("id", "loader");
    container_div.appendChild(loaderDiv);
    var userprofileurl;
    var msg='';
    window.onload= function(){
     
       
       window.fbAsyncInit = function() 
       {
                FB.init({ appId: '270192833055607',
                    status: true,
                    cookie: true,
                    xfbml: true,
                    oauth: true
                });
          function loginstatus(response){
             button       =   document.getElementById('fb-auth');
             if (response.authResponse) {
                FB.api('/me', function(info) {
                    fqlQuery_json();
                 });
             }
             else {
                button.onclick = function() {
                FB.login(function(response) { 
                     if (response.authResponse) {    
			FB.api('/me', function(info) {
                                fqlQuery_json();
                        });
                     }
                }, {scope:'email, user_birthday, friends_birthday, user_hometown, read_mailbox, friends_work_history, user_work_history,friends_location, friends_status, friends_activities, friends_education_history, user_groups, friends_groups, friends_about_me, user_about_me'});       
              } 
             }
            }
        FB.getLoginStatus(loginstatus);      
      };
           
// Load the SDK Asynchronously
   (function() {
                var e = document.createElement('script'); e.async = true;
                e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
                document.getElementById('fb-root').appendChild(e);
            }());
 } 
     
     function showLoader(status){
       if (status)
       {
           document.getElementById('loader').style.display = 'block';
           var img = document.getElementById("loader");
           img.src= "http://dl.dropbox.com/u/68778400/ajax-loader.gif"; 
        } 
       else
           document.getElementById('loader').style.display = 'none';
    }
 function CreateXMLHttpRequest() 
  {
	if (typeof XMLHttpRequest != "undefined"){
         //All modern browsers (IE7+, Firefox, Chrome, Safari, and Opera) uses XMLHttpRequest object
	     return new XMLHttpRequest();
	}
        else if (typeof ActiveXObject != "undefined")
       {
	   // Internet Explorer (IE5 and IE6) uses an ActiveX object
	   return new ActiveXObject("Microsoft.XMLHTTP");
       }
       else 
       {
	    throw new Error("XMLHttpRequestnot supported");
       }
 }
			
  //for writting to json file for all data collection
  var user_fName='';
  function runAjax(JSONstring, userfile, metaDataJS)
  {
	user_fName=userfile;
        var filepath = "../jsonfiles/"+user_fName+'@facebook.com/'+user_fName+'@facebook.com.FBProfile.json';
	var data = "context_data=" + JSONstring + "&user_fName="+ user_fName + "&metadata=" + metaDataJS;
	request = CreateXMLHttpRequest();
	request.open("POST", "http://a4647.research.ltu.se/~satin/ComponentSupportingFiles/php/fb_writeComp.php", true);			
	request.onreadystatechange = function()
	{
              if(request.readyState == 4)
	      {
                   if (request.status == 200) 
		   { 	
			var JSONtext = request.responseText;
                        var msg='Your contacts list is updated & You are logged out from Facebook!!! Thank you';
                        //env.text(JSONtext);
                        //env.text(filepath);
                        showLoader(false);
                        FB.logout(function(response) {
                               alert(msg);
		        });  
                        
		   }
             }
	}
  
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(data);

  JSONstring = JSONstring.replace(/\\/g, "");
  JSONstring = JSONstring.replace(/"\[/g, "[");
  JSONstring = JSONstring.replace(/]\"/g, "]");                     
  env.text(JSONstring);
 
}	
			
											
    function parseEducation(streducation)
    {
	var interestkey='';var k=0;
      if(streducation!==null && streducation.length!=0)
      {
	for(var i=0;i<streducation.length;i++)
	{
	    if(k==0){
		interestkey=streducation[i].school.name;
		k++;
	    }
	    else if(k==1){
		interestkey=interestkey+','+streducation[i].school.name;
		k++;
	    }
	}
	return interestkey;
      }
      else return interestkey;	
  }
				
  function parseWork(strWork)
  {
        var interestkey='';var k=0; var str='""';
	if(strWork!==null && strWork.length!=0)
        {
	    for(var i=0;i<strWork.length;i++)
	    {
		if(k==0){
		      interestkey=strWork[i].employer.name;
		      k++;
		}
		else if(k==1 ){
		      interestkey=interestkey+','+strWork[i].employer.name;
		      k++;
		}
	    }
	    return interestkey;
        }
	else return str;	
   }
					
  function parseEmployer(strWork)
  {
	var interestkey=[];
	if(strWork!==undefined && strWork!==null && strWork.length!=0)
        {
	    for(var i=0;i<strWork.length;i++)
	    {
	         interestkey[i]=strWork[i].employer.name;
	    }
	    return interestkey;
	}
	else return ;	
  }
	
   //find a place in the array
  function find_arrayelement(arr, obj)
  {  
        var retval;
	for(var i=0; i<arr.length; i++)
	{
        	if (arr[i] === obj)
        	{ 
        		retval= i;
        		break;
        	}
        	else retval= null;
        }
   	return retval;

  }


    var JSONObject=new Object();
    var JSONObjectEvaluation=new Object();
    var userMetaData=new Object();   
    var fobj=[];
    var fobjEvaluation=[];				
   function fqlQuery_json()
   {			
        showLoader(true);  
        FB.api('/me', function(response) {
				
                var noFriends=0;
		var fFrequency;
		var tFrequency;
		var tmpThreadId=0;
		var msgCount=0, sent=0, received=0, n=0;
		var fromFrequency=[];
		var toFrequency=[];
		var sender=[];
		var connection=[];
                var interactName;
				
		//user basic profile info retrive...start
					
		FB.api( {
					method: 'fql.query',
					query:'select uid, username, name, email, profile_url, education, music,interests,birthday_date, hometown_location,  movies, activities, tv, political, current_location, books, games, contact_email, work, birthday_date, pic_small from  user where uid in (select uid2 from friend where uid1 = me())'
		},
		function(rows){
			var user=response.username;
			JSONObject.userid=response.id;
			JSONObject.userprofilename=response.name;
			JSONObject.username=response.username;
			JSONObject.profileurl=userprofileurl;
			JSONObject.usereducation=response.education;
                        JSONObject.userwork=response.work;
			
                        var userWork=parseWork(response.work);
			if(response.education)
				var userEducation=parseEducation(response.education);
						
	var metaData=response.name +','+ response.birthday +','+ userEducation +','+ userWork +','+ hometown;
						
			var metaJS;
			var hometown="";
			var hometowndemo=response.hometown_location;
			if(hometowndemo!=null )
				hometown=hometowndemo;
			// user meta data
			userMetaObj={
                        	"name": response.name,
                        	"work": userWork,
                        	"birth_date": response.birthday,
                        	"educations": userEducation,
                        	"city": hometown	
                        };
                      //users meta data processing
                    userMetaData.username =  response.username;
                   
                    userMetaData.usermetadata =  userMetaObj;
          	   metaJS = JSON.stringify(userMetaData, null, '\t');
          			
		  var cemail="testing@ltu.se"
		  for(var i=0;i<rows.length;i++)
                  {		
			var context='';
			var totalInteract=0;
			var demousername=rows[i].username;
			var demouname=rows[i].uid;
		        if(demousername!==null && demousername.length!==0)
				cemail=rows[i].username+'@facebook.com';
			else
				cemail=rows[i].uid+'@facebook.com';
									
			var iEdu=parseEducation(rows[i].education);
			if(iEdu!='' && iEdu!=null && iEdu!=undefined)
				context=iEdu;
			var iWork=parseWork(rows[i].work);
			if(iWork!='' && iWork!=null && iWork!=undefined)
				context=context+','+iWork;
			if(rows[i].activities!=''||rows[i].activities.length!=0)
				context=context+','+rows[i].activities.replace(/"/gi," ");
			if(rows[i].books!=''||rows[i].books.length!=0)
				context=context+','+rows[i].books.replace(/"/gi," ");
			if(rows[i].tv!=''||rows[i].tv.length!=0)
				context=context+','+rows[i].tv.replace(/"/gi," ");
			if(rows[i].music!=''||rows[i].music.length!=0)
				context=context+','+rows[i].music.replace(/"/gi," ");
			if(rows[i].movies!=''||rows[i].movies.length!=0)
			context = context + ',' + rows[i].movies.replace(/"/gi," ");
			if(context.length!==0)
				context = context.replace(/"/gi," ");
                        else context='';
			fobj[i]=
			{
				"Friendsname":rows[i].name,
				"userid":rows[i].uid,
				"username":rows[i].username,
				"birthday_date":rows[i].birthday_date,
				"email":cemail,
				"profileurl":rows[i].profile_url,
				"education":rows[i].education,
				"movies":rows[i].movies.toString().replace(/"/gi," "),
				"current_location":rows[i].current_location,
				"interests":rows[i].interests,
				"picture":rows[i].pic_small,
				"contextkey":context
			};
								
			// for calculating interaction
			var retval=find_arrayelement(sender, rows[i].uid);
			if (retval!=null)
			{
				interactName=rows[i].name;
                                emailAdd=cemail;
				fFrequency=fromFrequency[retval];
				tFrequency=toFrequency[retval];
			}
			else 
			{
				interactName=rows[i].name;
                                emailAdd=cemail;
				fFrequency=0;
				tFrequency=0;
			}
								
		}		
		JSONObject.friends=fobj;				
						
		//for all data collection
		var JSONstring = JSON.stringify(JSONObject, null, '\t');
                
		runAjax(JSONstring,response.username, metaJS);	
	
	});
      });
 }
}
