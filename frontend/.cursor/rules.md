this is a leave management app, there are two kinds of people using this app one is employee on is manager. employees can apply leaves and employees can view their leaves that they have applied. manager can see all the leaves applied each and every employee out there and either accept or reject the leave. initially the status of the leave will be pending. 

current progress of this app:
as of now there is a login screen where employees can login with their mails, the employees can login with their mail and firebase authentication is being used for login and there is a firestore also been setup where the role data is been set"employee", "manager". there will be a uid in firebase for particular user that uid will be used to access the roles in the firestore data has been set up in this way as of now all these things need no change. 

things to do :
i code for two new pages "employee_leave_page", manager_leave_page. the files have been already created for employee page 
@employee_leave_page.component.ts,@emplpoyee_leave_page.component.html,@employee_leave_page.component.css. for manager @manager_leave_page.component.ts, @manager_leave_page.component.html,manager_leave_page.component.css use these files to edit the routing the page from the login page is already handeled. things needed in those pages 
employee_leave_page:
i need to display all the leaves request made by the particular employee and the status show green approved or re rejected or orange pending colours in status column. the same uid used for getting roles can be used for getting the relavent data from the api the url will API Base URL: http://127.0.0.1:8000 

GET /leave/my-leaves/{employee_id}
needs a employee uid the uid that we got from the firebase 
Response:
[
  {
    "leave_id": "string",
    "leave_type": "string",
    "start_date": "string",
    "end_date": "string",
    "status": "string"
  }
]

there should be apply leave option to the employee where they can apply leave it should be kind of popup form 
the api for posting leave is 

POST /leave/apply

{
  "employee_id": "string",
  "leave_type": "string",
  "start_date": "2025-12-21",
  "end_date": "2025-12-21",
  "reason": "string"
}
in this employee id should be auto filled by you the employee id is the same id we get from the firebase analyse the whole code to understand how firbase has been set in this project in the angularassignment folder

Manager_leave_page:

in this page all the leave request thats been made by all the employee should be visible to the manager. the data can be get from api , Base URL: http://127.0.0.1:8000 

GET /leave/all

next for every leave request showed in the page there should be a button to accept ot reject the leave the button should be connect to api route

POST /leave/{leave_id}/{action}

this requests need two paramaeters leave_id(the leave id that been assigned for that particular leave data ), action is string with either "accept" or "reject".




make sure to first read all the file in the project understand and then code also make sure the logic is such a way that whenever a axction is done like manager rejecting the leave the leave page is updated by doing a GET request again for both lemployee and also the manager so that screen stays updated the syling is been done by css and the styling can be decent and elagent and simple but vey functional