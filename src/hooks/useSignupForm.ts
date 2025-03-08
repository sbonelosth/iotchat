import { useState, useEffect } from 'react';
import { validateRegistration } from '../utils/validationUtils';
import { facultyData, departmentData, qualificationData } from '../data/data';
import { useAuth } from '../contexts/AuthContext';

export const useSignupForm = () => {
  const { signup, isLoading, authError, setAuthError } = useAuth();
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedQualification, setSelectedQualification] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAgreement, setIsAgreement] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);

  useEffect(() => {
    if (studentNumber) {
      setEmail(`${studentNumber}@dut4life.ac.za`);
    }
  }, [studentNumber]);

  useEffect(() => {
    setIsFormValid(
      studentNumber !== '' &&
      password !== '' &&
      firstName !== '' &&
      lastName !== '' &&
      email !== '' &&
      selectedFaculty !== '' &&
      selectedDepartment !== '' &&
      selectedQualification !== ''
    );
  }, [studentNumber, password, firstName, lastName, email, selectedFaculty, selectedDepartment, selectedQualification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAgreement) {
      setShowRegistrationPopup(true);
    } else {
      setAuthError({ title: 'Agreement Required', message: 'You have to agree to the terms of use and policies to continue.' });
      setShowError(true);
    }
  };

  const handleRegistrationConfirm = async () => {
    const signupData = {
      username: studentNumber,
      name: firstName + ' ' + lastName,
      email,
      password,
      faculty: selectedFaculty,
      department: selectedDepartment,
      course: selectedQualification,
      joined: new Date().toString(),
    };

    try {
      const result = await signup(signupData);
      if (!result.success) {
        setShowError(true);
        return;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setShowError(true);
    } finally {
      setShowRegistrationPopup(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case 'studentNumber':
        setStudentNumber(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
    const errors = validateRegistration(name, value, validationErrors);
    setValidationErrors({ ...validationErrors, ...errors });
    setShowError(false);
  };

  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreement(event.target.checked);
  };

  const getQualificationsForDepartment = (department: string): { group: string, name: string }[] => {
    return qualificationData[department] || [];
  };

  const facultyOptions = [
    { value: '', label: 'Select Faculty' },
    ...facultyData.map(faculty => ({ value: faculty, label: faculty }))
  ];

  const departmentOptions = [
    { value: '', label: 'Select Department' },
    ...(selectedFaculty && departmentData[selectedFaculty]
      ? departmentData[selectedFaculty].map(dept => ({ value: dept, label: dept }))
      : [])
  ];

  const qualificationOptions = [
    { value: '', label: 'Select Qualification' },
    ...(selectedDepartment
      ? getQualificationsForDepartment(selectedDepartment).map(qual => ({ value: qual.group, label: `${qual.group}: ${qual.name}` }))
      : [])
  ];

  return {
    studentNumber,
    setStudentNumber,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    selectedFaculty,
    setSelectedFaculty,
    selectedDepartment,
    setSelectedDepartment,
    selectedQualification,
    setSelectedQualification,
    showPassword,
    setShowPassword,
    isAgreement,
    setIsAgreement,
    validationErrors,
    setValidationErrors,
    isFormValid,
    showError,
    setShowError,
    showRegistrationPopup,
    setShowRegistrationPopup,
    handleSubmit,
    handleRegistrationConfirm,
    handleInputChange,
    handleAgreementChange,
    facultyOptions,
    departmentOptions,
    qualificationOptions,
    isLoading,
    authError
  };
};