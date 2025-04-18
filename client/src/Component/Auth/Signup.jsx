import React, { useState, useEffect, useRef } from "react";
import {
    Loader2
} from "lucide-react";
import { API_URL } from "../utils/Apiconfig";
import logo from "../../assets/logo.png";
import rightsignup from "../../assets/signup-right.png";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast } from 'react-toastify';
import useLoadingStore from "../../store/UseLoadingStore";
const Signup = () => {
    const inputRefs = useRef([]);
    const { isLoading, showLoading, hideLoading } = useLoadingStore();
    const navigate = useNavigate();
    const [isVerifyButtonVisible, setIsVerifyButtonVisible] = useState(false);
    const [fullName, setFullName] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [countryCode, setCountryCode] = useState('+1'); 
    const [email, setEmail] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [securityQuestion, setSecurityQuestion] = useState(""); // Security Question input
    const [securityQuestion2, setSecurityQuestion2] = useState(""); // Security Question input
    const [securityAnswer, setSecurityAnswer] = useState(""); // Stores the answer
    const [securityAnswer2, setSecurityAnswer2] = useState(""); // Stores the answer
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isDialogOpen2, setDialogOpen2] = useState(false);
        const [isotpsendbox, setIsotpsendbox] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // Tracks steps (Security Question, Phone Verification, OTP)
    // const [selectedQuestions, setSelectedQuestions] = useState([]);
    // const [answers, setAnswers] = useState([]);
    const [otp, setOtp] = useState(new Array(6).fill("")); // Creates an array of 6 empty strings
    const [phoneNumber, setPhoneNumber] = useState(''); // Phone number input
    const [isCheckboxChecked, setCheckboxChecked] = useState(false);
    const [outerCheckboxChecked, setOuterCheckboxChecked] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const recaptchaContainer = React.useRef(null);
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [selectedQuestions, setSelectedQuestions] = useState(Array(4).fill(""));
    const [answers, setAnswers] = useState(Array(4).fill(""));
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [token, setToken] = useState("");
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsVerifyButtonVisible(true); 
    };
    const handleSendOTP = async () => {
hideLoading();
        try {
            showLoading();
            const response = await axios.post(`${API_URL}/api/auth/send-otp`, { email });
            if (response.data.success) {
                
                setMessage("OTP sent successfully! Please check your email.");
                // handleVerifyOtp();
                setIsVerifyButtonVisible(false);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("An error occurred while sending OTP.");
        }
        finally{
            hideLoading();
        }
    };


  const handleLogin = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setError("");
    
        // Validate email field
        if (!email) {
            setError("Email is required.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
    
        const loginRequestBody = { email };
    
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginRequestBody),
            });
    
            console.log('Response status:', response.status); // Log response status
    
            if (response.status === 404 ||response.status === 400) {
                // User not found
            
                setOtpSent(true);
                hideLoading();
                handleSendOTP();
                return;
            } 
            if (response.status === 200) {
                // User exists, proceed with OTP
                setError("Email already exists.");
            } else {
                // Handle other unexpected status codes
                const errorData = await response.json();
                setError(errorData.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("There was an error. Please try again.");
        }
    };








    const handleVerifyOtp = async (otpValue) => {
        try {
            // console.log("Sending OTP:", otpValue, "Email:", email);
            const response = await axios.post(`${API_URL}/api/auth/confirm-otp`, {
                email,
                otp: otpValue, // Ensure OTP is a string
            });
            if (response.status === 200) {
                setOtp("");
                setError(false);
                // alert('OTP verified successfully!');
                setIsOtpVerified(true);
            }
        } catch (err) {
            console.error("Error verifying OTP:", err.response?.data?.message);
            setError(err.response?.data?.message || 'Error verifying OTP');
        }
    };
    const otphandle = (e) => {
        setOtp(e.target.value);
    };

    // const verifyOTP = async () => {
    //     if (!confirmationResult) {
    //         setMessage('No OTP request found.');
    //         return;
    //     }

    //     try {
    //         await confirmationResult.confirm(otp); // Confirm OTP
    //         setMessage('Phone number verified successfully!');

    //         // Now proceed to update the phone number in your backend or move to next steps
    //         await updatePhoneNumber();
    //     } catch (error) {
    //         // console.log("Verification failed:", error.message);
    //         setMessage(`Failed to verify OTP: ${error.message}`);
    //     }
    // };



   











    const Nextfunc = async () => {
        const userId = user; 
        const securityAnswers = selectedQuestions.map((questionId, index) => ({
            question_id: questionId, // Send the ObjectId for the question
            answer: answers[index],
        }));

        try {
            const response = await axios.post(`${API_URL}/api/auth/set-questions`, {
                userId,
                securityAnswers,
            });

            // console.log(response.data); // Successful response from backend
            handleNextStep(); // Proceed to next step
        } catch (error) {
            setError("Error submitting questions and answers:", error);
        }
    };



    const handleQuestionChange = (index, value) => {
        if (selectedQuestions.includes(value)) {
            setError("This question has already been selected.");
            return;
        }

        setError(""); // Clear error if valid selection

        const updatedQuestions = [...selectedQuestions];
        updatedQuestions[index] = value; // Update only the current index
        setSelectedQuestions(updatedQuestions);
    };

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleFormSubmit = (e) => {

        e.preventDefault();

        if (!outerCheckboxChecked) {

            alert("You must agree to the terms and conditions to proceed.");
        }



    };
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/security-questions`);
                // const limitedQuestions = response.data.questions.slice(0, 3); // Fetch only the first 3 questions
                const limitedQuestions = response.data.questions; // Fetch only the first 3 questions
                
                setQuestions(limitedQuestions);
                setSelectedQuestions(new Array(3).fill(""));
                setAnswers(new Array(3).fill(""));
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Something went wrong.");
            }
        };
    
        fetchQuestions();
    }, []);
    

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Step-by-step validation for each field

        // Validate Full Name
        if (!fullName) {
            setError("Full Name is required.");
            return;
        }

        // Validate Email
        if (!email) {
            setError("Email is required.");
            return;
        }
        // Optionally add a regex to validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Validate Password
        if (!password) {
            setError("Password is required.");
            return;
        }

        // Validate Confirm Password
        if (!confirmPassword) {
            setError("Please confirm your password.");
            return;
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Validate Outer Checkbox (Terms and Conditions)
        if (!outerCheckboxChecked) {
            setError("You must agree to the terms and conditions.");
            return;
        }
        if (!isOtpVerified) {
            setError("Please verify email first");
            return;
        }

        // Step 1: Check if email already exists
        try {
            showLoading();
            const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (loginResponse.ok) {

                setError("Email already exists. Please use a different email or log in.");
                return;
            }
        } catch (loginError) {
          
            // console.log("Email does not exist, proceeding with sign-up...");
        }
        finally{
            hideLoading();
        }

        // Step 2: Proceed with sign-up
        const requestBody = {

            username: fullName,
            email: email,
            password: password,
        };

        try {
            showLoading();
            // Call your API to sign up the user
            // console.log("Request Body:", requestBody);

            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            // Check if the response is ok
            if (!response.ok) {
                throw new Error('Failed to sign up.');
                setDialogOpen2(false);
            }

            const data = await response.json();
            setToken(data.accessToken);
            setUser(data.user.user_id);
            setError(false);
            // Handle response here (e.g., navigate to a different page or show success message)
            // console.log('Success:', data);
            setMessage("");
            setDialogOpen2(true);
            // navigate('/next-page');  // Navigate to next page on successful sign-up
        } catch (error) {
            console.error('Error:', error);
            setError("There was an error during sign-up. Please try again.");
            hideLoading();
            setDialogOpen2(false);
        }
        finally {
            hideLoading();
        }

    };

    const checkPhoneNumber = async (phoneNumber) => {
        const data = { phoneNumber };

        // console.log("Checking phone number:", phoneNumber);

        try {
            const response = await fetch(`${API_URL}/api/auth/check-phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // Check if the response is successful (status 2xx)
            if (response.ok) {
                const contentType = response.headers.get('Content-Type');

                if (contentType && contentType.includes('application/json')) {
                    const responseData = await response.json();
                    if (responseData.message === "Phone number already registered.") {
                        setMessage("This phone number is already registered.");
                        return true; // Phone number exists
                    } else if (responseData.message === "Phone number is available.") {
                        setMessage("Phone number is available.");
                        return false; // Phone number is available
                    }
                } else {
                    setMessage("Received unexpected non-JSON response.");
                }
            } else {
                // Handle error response gracefully
                const errorData = await response.text(); // Read response as text
                console.error("Error response:", errorData);
                setMessage("Failed to check phone number.");
            }
        } catch (error) {
            console.error("Error details:", error);
            setMessage(error.message || "Failed to check phone number.");
        }
    };


    const handleCountryCodeChange = (event) => {
        setCountryCode(event.target.value);
      };

      const sendOtpWithTwilio = async () => {
        console.log("Payload:", { phone_number: `${countryCode}${phoneNumber}` });
    
        if (!phoneNumber || phoneNumber.trim() === '') {
            alert('Phone number is required.');
            return;
        }
    
        setLoading(true);
        try {
            console.log("Sending OTP...");
    
            const payload = { phoneNumber: `${countryCode}${phoneNumber}` };
    
            const response = await axios.post(`${API_URL}/api/otp/send-otp`, payload, {
                headers: {
                    'Content-Type': 'application/json', // JSON format mein bhej raha hai
                },
            });
    
            console.log("Response received:", response);
    
            if (response.data.success) {
                setMessage('OTP sent successfully!');
                handleNextStep();
            } else {
                setMessage(`Error: ${response.data.phone_number || 'Unknown error.'}`);
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            setMessage('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };
    

            const verifyOTP = async () => { 
                console.log("otp", otp);
                console.log("phone", `${countryCode}${phoneNumber}`);
        
                if (!otp || !phoneNumber) {
                  console.error("Missing OTP or Phone Number");
                  alert("OTP and phone number are required!");
                  return;
                }
               
              try {
                const requestBody = {
                  phoneNumber: `${countryCode}${phoneNumber}`, 
                  otp: otp.toString().trim()
              };
        
              console.log("Request Body:", requestBody);
            
                // Making the POST request using axios
                const response = await axios.post(`${API_URL}/api/otp/verify-otp`, requestBody, {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                });
                
                // Directly access the response data
                const data = response.data;
                console.log("response",data);
                if (data.success) {
                setMessage('Phone number verified successfully!');
                    await updatePhoneNumber();
                  }
                  else{
                    console.error("Error verifying OTP:", data.message);
                    alert(data.message || "Verification failed. Please try again.");
                  }
                
                }catch (error) {
                  console.error("Error verifying OTP:", error.response ? error.response.data : error.message);
                  alert('Error: OTP verification failed.');
                }
              };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phoneNumber.trim() === '') {
            setMessage('Please enter a phone number');
            return;
        }

        const isRegistered = await checkPhoneNumber(phoneNumber);
        if (!isRegistered) {
            sendOtpWithTwilio(phoneNumber);
        }
    };


    const onCaptchVerify = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response) => {
                        // console.log("reCAPTCHA solved:", response);
                    },
                    'expired-callback': () => {
                        // console.log("reCAPTCHA expired.");
                        resetRecaptchaVerifier();
                    },
                },
                auth
            );
        }
    };
    
    const resetRecaptchaVerifier = () => {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            // console.log("ReCAPTCHA cleared.");
        }
        onCaptchVerify(); // Reinitialize
    };
    
    const generateOTPWithVerification = async (phoneNumber) => {
        if (!phoneNumber) {
            toast.error('Please enter a valid phone number.');
            return;
        }
    
        resetRecaptchaVerifier(); // Ensure fresh RecaptchaVerifier
    
        const formatPh = '+91' + phoneNumber;
        // console.log('Formatted phone number:', formatPh);
    
        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formatPh, appVerifier);
    
            setConfirmationResult(confirmation);
            setMessage('OTP sent to your phone.');
            handleNextStep();
        } catch (error) {
            console.error('Error during OTP generation:', error);
            if (error.code === 'auth/internal-error') {
                console.error('Internal error: Check Firebase project settings and network status.');
            }
            setMessage(`Failed to send OTP: ${error.message}`);
        }
    };
    
    
    




    const updatePhoneNumber = async () => {
        const phone = { email, phoneNumber }; // Ensure you're sending email and phoneNumber

        // console.log("Login Payload:", phone);

        try {
            const response = await fetch(`${API_URL}/api/auth/update-phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(phone),
            });

            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();  // Parse the response body as JSON
                setMessage(data.message || "Phone number updated successfully.");
                handleFinalSubmit();
            } else {
                // If response is not successful, handle the error
                const errorData = await response.json();  // Parse the error response
                if (errorData.message === "This phone number is already registered.") {
                    setMessage("This phone number is already registered with another account.");
                } else {
                    setMessage(errorData.message || "Failed to update phone number.");
                }
            }
        } catch (error) {
            // Handle any network or unexpected errors
            console.error("Error details:", error);
            setMessage(error.message || "Failed to update phone number.");
        }
    };

    const handleNextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleFinalSubmit = () => {
        // Optionally, show a success message or perform some action
        setDialogOpen2(false);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user);
        // Navigate to the desired page
        navigate('/subscription');  // Replace '/your-new-page' with the path to your new page
    };
    const handlePhoneNumberChange = (e) => {
        let input = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
      
        if (input.length > 10) {
          input = input.slice(0, 10); // Limit to 10 digits
        }
      
        let formatted = input;
      
        if (input.length > 6) {
          formatted = `(${input.slice(0, 3)})-${input.slice(3, 6)}-${input.slice(6)}`;
        } else if (input.length > 3) {
          formatted = `(${input.slice(0, 3)})-${input.slice(3)}`;
        } else if (input.length > 0) {
          formatted = `(${input}`;
        }
      
        setPhoneNumber(formatted);
      };


    const handleOtpSubmit = () => {
        const otpValue = otp.join(""); // Convert the array to a single string
        if (otpValue.length === 6) {
            // console.log("Submitting OTP:", otpValue);
            handleVerifyOtp(otpValue); // Pass the OTP string
        } else {
            console.error("Please fill all 6 digits of the OTP.");
        }
    };

    // }; 
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
            if (index > 0) {
                inputRefs.current[index - 1]?.focus(); // Move to the previous input
            }
        }
    };
    const handleOtpInputChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value.slice(0, 1); // Only keep 1 digit
            setOtp(newOtp);
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus(); // Move to the next input
            }
        }
    };


    return (
        <div className="flex flex-col md:flex-row h-full text-white md:justify-center">
            {/* Left Section */}

            <div id="recaptcha-container"></div>
            <div className="lg:w-2/4 w-full flex flex-col justify-center items-center p-3 md:p-10">
                <div className=" h-full w-full">
                    <div className="bg-white text-black p-4 min-h-full rounded-lg min-w-full max-w-md flex justify-center flex-col">
                        {/* Logo */}
                        <div className="flex items-center mb-5 lg:w-full sm-w-[20%] w-full">
                            <img src={logo} alt="Cumulus Logo" className="min-h-8 w-full object-fit" />
                        </div>

                        <h1 className="text-2xl font-bold mb-2 text-left">Registration</h1>
                        <p className=" text-gray-600 mb-4 text-left">
                            Please fill out the following information.
                        </p>

                        {/* Form */}
                        <form className="space-y-4 max-w-full" onSubmit={handleFormSubmit}>
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                                        }`}
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 pr-20" // Add padding-right for button space
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                    />
                                    {isVerifyButtonVisible && !isOtpVerified && (
                                        <button
                                            type="button"
                                            className="absolute top-[55%] right-3 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                                            onClick={handleLogin}
                                        >
                                            {isLoading ? (

                                                <span className="cursor-not-allowed flex justify-center"> <Loader2 className="animate-spin h-6 w-6 font-bold" /></span>
                                            ) : (
                                                'Verify'
                                            )}

                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* OTP Verification */}
                            {otpSent && !isOtpVerified && (
                                <div className="space-y-4">
                                    <label htmlFor="otp" className="block text-sm font-medium">
                                        Enter OTP
                                    </label>
                                    <div className="flex space-x-2">
                                        {otp.map((_, index) => (
                                          <input
                                          key={index}
                                          type="tel"
                                          inputMode="numeric" // Ensures number keyboard on mobile
                                          pattern="[0-9]*" // Restricts input to numbers
                                          className="w-10 h-10 text-center border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                          maxLength={1}
                                          value={otp[index]}
                                          onChange={(e) => handleOtpInputChange(e, index)}
                                          onKeyDown={(e) => handleKeyDown(e, index)}
                                          ref={(el) => (inputRefs.current[index] = el)}
                                      />
                                      
                                        ))}
                                    </div>
                                    {isLoading ? (<button
                                        type="submit"
                                        className="cursor-not-allowed flex justify-center  bg-blue-400 w-full py-2 rounded-md text-white"
                                    >
                                        <Loader2 className="animate-spin h-6 w-6 font-bold" />
                                    </button>) : (<button
                                        type="button"
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        onClick={handleOtpSubmit}
                                    >
                                        Verify Otp
                                    </button>
                                    )}
                                </div>
                            )}


                            <div>
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                                        }`}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className={`w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                                        }`}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Inline error message */}


                            {/* Terms */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="h-4 w-4 border-gray-300 rounded"
                                    checked={outerCheckboxChecked} // Bind to outerCheckboxChecked
                                    onChange={() => setOuterCheckboxChecked(!outerCheckboxChecked)} // Handle toggle
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm text-gray-600 leading-tight"
                                >
                                    By signing up, you agree to our{" "}
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() => setDialogOpen(true)}
                                    >
                                        Privacy Policy
                                    </button>{" "}
                                    and{" "}
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() => setDialogOpen(true)}
                                    >
                                        Terms of Service
                                    </button>.
                                </label>
                            </div>

                            {/* Submit */}
                            {isLoading ? (
    <button
        type="submit"
        className="cursor-not-allowed flex justify-center bg-blue-400 w-full py-2 rounded-md text-white"
    >
        <Loader2 className="animate-spin h-6 w-6 font-bold" />
    </button>
) : (
    <button
        type="submit"
        className={`w-full py-2 rounded-md transition ${
            outerCheckboxChecked
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-400 text-white"
        }`}
        onClick={handleSignUp}
    >
        Sign Up
    </button>
)}

                        </form>
                        <p className="text-center text-gray-500 mt-4">
                            have an account?{" "}
                            <Link to="/Login" className="text-blue-500">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section */}

            <div className="hidden min-h-screen z-10 lg:flex md:w-3/5 bg-slate-100 justify-center items-center">
                <img
                    src={rightsignup}
                    alt="Illustration"
                    className="right-img-on-des min-w-full bg-cover bg-no-repeat bg-center max-h-[700px]"
                />
         
            </div>







            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-0">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
                        {/* Close Icon */}
                        <button
                            className="absolute top-3 right-5  md:top-3 md:right-3 text-gray-600 hover:text-black"
                            onClick={() => setDialogOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Title */}
                        <h2 className="text-xl font-bold mb-4 text-black">Terms of Service</h2>

                        {/* Terms Text */}
                        <p className=" text-xs md:text-sm text-gray-600 overflow-y-auto  mb-4">
                            terms as your use of FidSafe reaffirms your continuing agreement to the then-current User Agreement. This User Agreement is distinct from, and in addition to, any other agreements between you and Fidelity Investments ("Fidelity"), if any. Additionally, you acknowledge that non-Fidelity parties may provide portions of the FidSafe Service ("third-party service provider") in accordance with the terms of this User Agreement.
                            By clicking the I Agree button, you agree to be bound by, and to act in accordance with, this User Agreement in order to use FidSafe. You certify that you are at least 18 years of age and are a US resident.
                            {/* Add content here */}
                        </p>
                        <h2 className="text-xl  mb-1 text-black">Cumulus Account</h2>
                        <p className="text-xs md:text-sm text-gray-600 overflow-y-auto max-h-60 mb-4">You have elected to enroll in the FidSafe Service and to create a secure FidSafe Account ("Account") that will only be accessible to you ("User"). The FidSafe Service may allow you, among other things, to store, upload, access, download, review, share and delete copies of your Content that have been uploaded into your Account via the internet in compliance with this User Agreement. In other circumstances, the FidSafe Service may allow you only to access, download and review copies of electronic files that have been shared with you by another FidSafe user. We make no effort to review your Content for accuracy, legality, non-infringement, or for any</p>
                        {/* Checkbox */}
                        <div className="flex items-center space-x-2 mb-4">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                className="h-4 w-4 border-gray-300 rounded"
                                checked={isCheckboxChecked}
                                onChange={(e) => setCheckboxChecked(e.target.checked)}
                            />
                            <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                                By signing this, you agree to the Privacy Policy and Terms of Service.
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 text-sm bg-white border border-blue-500 text-blue-500 rounded-md hover:bg-gray-400"
                                onClick={() => {
                                    setDialogOpen(false);
                                    setCheckboxChecked(false); // Reset the checkbox on decline
                                }}
                            >
                                Decline
                            </button>
                            <button
                                className={`px-4 py-2 text-sm rounded-md ${isCheckboxChecked
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-blue-400 text-white cursor-not-allowed"
                                    }`}
                                disabled={!isCheckboxChecked}
                                onClick={() => {
                                    setDialogOpen(false);
                                    setOuterCheckboxChecked(true); // Update outer checkbox when accepted
                                    // alert("Terms accepted!");
                                }}
                            >
                                I Agreed
                            </button>
                        </div>
                    </div>
                </div>
            )}




{isDialogOpen2 && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-0">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      {/* Close Icon */}
      {/* <button
        className=" top-5 bg-black text-gray-600 hover:text-black"
        onClick={() => setDialogOpen2(false)}
      >
        <X className="h-6 w-6" />
      </button> */}

      {currentStep === 1 && (
        <div>
            <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-2 md:mb-3 text-black">
            Security Questions
          </h2>
          <button
        className=" top-5 text-gray-600 hover:text-black"
        onClick={() => {setDialogOpen2(false);
            hideLoading();
        }}
      >
        <X className="h-6 w-6" />
      </button>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            These are used during password recovery or to verify your identity when logging in from an unrecognized device.
          </p>

          {/* Step Navigation */}
          <div className="flex items-center space-x-4 mb-2">
            <div className="text-black">
              <span className="p-1 px-2 md:p-1 md:px-2.5 bg-blue-500 rounded-2xl text-sm text-black">1</span>
              <span className="ml-1 md:ml-2 text-xs md:text-lg">Security question</span>
            </div>
            <span className="text-black text-xs md:text-lg"> &gt; </span>
            <div className="text-black">
              <span className="p-1 px-2 md:p-1 md:px-2.5 bg-gray-200 rounded-2xl text-sm text-black">1</span>
              <span className="ml-1 md:ml-2 text-xs md:text-lg">Phone Verification</span>
            </div>
          </div>

          {/* Scrollable Security Questions Form */}
          <div className="security-questions-form max-h-[70vh] overflow-y-auto">
          {questions.slice(0, 3).map((questionObj, index) => (
  <div key={index} className="mb-4">
    <label
      htmlFor={`securityQuestionDropdown-${index}`}
      className="block text-sm font-medium mb-2 text-black"
    >
      Select a security question
    </label>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <select
      id={`securityQuestionDropdown-${index}`}
      value={selectedQuestions[index] || ''} // Handle undefined initial state
      onChange={(e) => handleQuestionChange(index, e.target.value)}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 text-black"
    >
      <option value="" disabled>
        Select a question
      </option>
      {questions
        .filter(
          (q) =>
            !selectedQuestions.includes(q._id) || q._id === selectedQuestions[index] // Include currently selected option
        )
        .map((q) => (
          <option key={q._id} value={q._id}>
            {q.question}
          </option>
        ))}
    </select>
    <div className="mb-4">
      <input
        type="text"
        id={`securityAnswer-${index}`}
        value={answers[index] || ''}
        onChange={(e) => handleAnswerChange(index, e.target.value)}
        className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="Answer here"
        disabled={!selectedQuestions[index]} // Disable input if no question is selected
      />
    </div>
  </div>
))}


            <button
              onClick={Nextfunc}
              disabled={
                selectedQuestions.includes('') || answers.includes('') // Disable if any question or answer is empty
              }
              className={`w-full py-2 rounded-md ${selectedQuestions.includes('') || answers.includes('')
                ? 'bg-white text-blue-500 border border-blue-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              Submit
            </button>
          </div>
        </div>
      )}
{currentStep === 2 && (
   <div>
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold mb-3 text-black">
                    Phone Verification (optional)
                  </h2>
                  <button
                    className="top-5 text-gray-600 hover:text-black"
                    onClick={() => {
                      setDialogOpen2(false);
                      hideLoading();
                    }}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <hr />

                <div className="flex items-center space-x-4 ">
                  {/* <div className="text-black">
        <span className="p-1 px-2 md:p-1 md:px-2.5 bg-blue-500 rounded-2xl text-sm text-black">1</span>
        <span className="ml-1 md:ml-2 text-xs md:text-lg">Security question</span>
      </div> */}
                  {/* <span className="text-black text-xs md:text-lg">&gt;</span> */}
                  {/* <div className="text-black"> */}
                  {/* <span className="p-1 px-2 md:p-1 md:px-2.5 bg-blue-500 rounded-2xl text-sm text-black">2</span> */}
                  {/* <span className="ml-1 md:ml-2 text-xs md:text-lg">Phone Verification</span>
      </div> */}
                </div>

                <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg shadow-md mt-4">
                  <select
                    className="border text-black border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+91">+91 (IND)</option>
                    <option value="+81">+81 (JPN)</option>
                  </select>
                  <div className="w-full">
                    <input
                      type="text"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 mt-2 py-5 px-0 items-start">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    className="h-4 w-4 border-gray-300 rounded mt-1"
                    checked={isotpsendbox}
                    onChange={(e) => setIsotpsendbox(e.target.checked)}
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-[12px] leading-[20px] text-gray-600 "
                  >
                    I consent to receive security related text messages from
                    Cumulus Inc. I understand that Cumulus will send me a code
                    for two factor authentication during each sign-in. Message
                    rates may apply.
                  </label>
                </div>
                <div className="flex justify-center mt-2">
                  <span
                    className="text-[13px] text-blue-600 underline decoration-blue-600 mr-1"
                    onClick={() => navigate("/privacy")}
                  >
                    Privacy Policy
                  </span>
                  <span
                    className="text-[13px] text-blue-600 underline decoration-blue-600"
                    onClick={() => navigate("/terms")}
                  >
                    | Terms & Conditions
                  </span>
                </div>

                {message && (
                  <div className="mt-4 p-2 border rounded-md text-center bg-gray-100 text-gray-800">
                    {message}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={phoneNumber.length < 10 || !isotpsendbox}
                  className={`w-full mt-4 py-2 rounded-md ${
                    phoneNumber.length < 10 || !isotpsendbox
                      ? "bg-white text-blue-500 border border-blue-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>

                <button
                  onClick={handleFinalSubmit}
                  className="w-full mt-2 py-2 border border-gray-300 text-gray-600 hover:text-black rounded-md"
                >
                  Skip for now
                </button>
              </div>
)}

      {currentStep === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-black">Phone Verification</h2>
          <hr />
          <p className="text-xs text-gray-600 mb-3">
            We just sent a unique code to your phone. Please be patient as it may take a few minutes for the code to arrive. When you receive the code, please enter it below.
          </p>

          <div className="flex items-center space-x-4">
            <div className="text-black">
              <span className="p-1 px-2 md:p-1 md:px-2.5 bg-blue-500 rounded-2xl text-sm text-black">1</span>
              <span className="ml-1 md:ml-2 text-xs md:text-lg">Security question</span>
            </div>
            <span className="text-black text-lg"> &gt; </span>
            <div className="text-black">
              <span className="p-1 px-2 md:p-1 md:px-2.5 bg-blue-500 rounded-2xl text-sm text-black">2</span>
              <span className="ml-1 md:ml-2 text-xs md:text-lg">Phone Verification</span>
            </div>
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium shadow-sm">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              maxLength={6}
              onChange={otphandle}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter OTP"
            />
          </div>

          <button
            onClick={verifyOTP}
            disabled={!otp}
            className={`w-full mt-4 py-2 rounded-md ${otp
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-white text-blue-500 border border-blue-500'
              }`}
          >
            Submit
          </button>
        </div>
      )}

      {/* Back Button */}
      {currentStep > 1 && (
        <button
          onClick={handlePreviousStep}
          className="w-full mt-2 py-2 bg-white text-blue-500 border border-blue-500 rounded-md hover:bg-gray-400"
        >
          Back
        </button>
      )}
    </div>
  </div>
)}

        </div>
    );
};


export default Signup;
