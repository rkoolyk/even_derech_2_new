# even_derech_2_new
2nd milestone, Advanced Programming 2 -- Flight Simulator

**Features Implemented:**
* Uploading Files 
  * Button to upload train csv file
  * Button to upload flight csv file 
* Algorithm selection 
  * Simple Algorithm
  * Hybrid Algorithm 
* Submit Button 
  * Upon submission, anomaly data is shown in the frame 
* Frame
  * iframe in which anomalies are shown 

**Project Structure:**

 The application is built using the MVC structure 
 * View
   *  index.html is responsible for the visual presentation of the application 
 * Controller
   *  server.js passes the information from the requests from the view to the model and returns the response 
 * Model
   *  util_anomaly_detection.js contains the base functions for anomaly related calculations 
   *  timeseries.js builds a timeseries to decipher the data 
   *  SimpleAnomalyDetector.js detects anomalies using the simple regression line based algorithm
   *  HybridAnomalyDetector.js detects anomalies using the hybrid algorithm, which is a combination of min-circle and regression line algorithms

**Necessary Installations:**
* Node.js - https://nodejs.org/en/
* node modules to install: 
  * express
  * express-fileupload
  * smallest-enclosing-circle
  * filereader

**Instruction to Run Application:**
  * After completing the appropriate installations, download project files to computer
  * Open the terminal and enter the controller folder 
  * Run the command- node server 
  * Open the webpage http://localhost:8080
  * Upload files, choose algorithm and press submit 
  * The anomalies will now be shown in the frame 

**Additional Links:**
  * UML layout https://github.com/rkoolyk/even_derech_2_new/blob/master/UML.JPG
  * Video demo of App https://youtu.be/FwZ7vU0Mxto
