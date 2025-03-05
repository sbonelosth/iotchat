import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Building, GraduationCap, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { facultyData, departmentData, qualificationData } from '../../data/data';
import AuthModal from './AuthModal';

interface SignupFormProps {
  onToggleForm: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onToggleForm }) => {
  const { user, signup, isLoading, authError, setAuthError } = useAuth();
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedQualification, setSelectedQualification] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isAgreement, setIsAgreement] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);

  useEffect(() => {
    if (studentNumber) {
      setEmail(`${studentNumber}@dut4life.ac.za`);
    }
  }, [studentNumber]);

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
      studentNumber,
      firstName,
      lastName,
      email,
      password,
      faculty: selectedFaculty,
      department: selectedDepartment,
      qualification: selectedQualification,
      joinDate: new Date().toISOString(),
    }

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

  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreement(event.target.checked);
  };

  // Function to get qualifications for a department
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

  return (
    <form onSubmit={handleSubmit}>
      {showError && (
        <div className="bg-red-900/30 border border-red-500 border-dotted text-red-200 px-4 py-2 mb-4 rounded-lg">
          {authError.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder=""
          required
        />
        <Input
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder=""
          required
        />
      </div>

      <Input
        label="Student Number"
        type="text"
        value={studentNumber}
        onChange={(e) => setStudentNumber(e.target.value)}
        placeholder=""
        icon={User}
        required
      />

      <Input
        label="Email"
        type="email"
        value={email}
        icon={Mail}
        readOnly
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder=""
        icon={Lock}
        rightIcon={showPassword ? EyeOff : Eye}
        onRightIconClick={() => setShowPassword(!showPassword)}
        required
      />

      <Select
        label="Faculty"
        value={selectedFaculty}
        onChange={(value) => {
          setSelectedFaculty(value);
          setSelectedDepartment('');
          setSelectedQualification('');
        }}
        options={facultyOptions}
        icon={Building}
        required
      />

      <Select
        label="Department"
        value={selectedDepartment}
        onChange={setSelectedDepartment}
        options={departmentOptions}
        icon={Building}
        disabled={!selectedFaculty}
        required
      />

      <Select
        label="Qualification"
        value={selectedQualification}
        onChange={setSelectedQualification}
        options={qualificationOptions}
        icon={GraduationCap}
        disabled={!selectedDepartment}
        required
      />

      <Button 
        type="submit" 
        fullWidth 
        isLoading={isLoading}
        icon={UserPlus}
      >
        Create Account
      </Button>

      <div className="flex items-center space-x-2 my-2">
        <input
          type="checkbox"
          id="agreement"
          checked={isAgreement}
          onChange={handleAgreementChange}
          className="text-blue-400 focus:ring-0 ring-0"
        />
        <label htmlFor="agreement" className="text-sm text-gray-400">
          I agree to the <a href="#" className="text-blue-400 hover:underline">terms of use</a> and <a href="#" className="text-blue-400 hover:underline">policies</a>
        </label>
      </div>

      <div className="text-center my-2">
        <button
          type="button"
          onClick={onToggleForm}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Already have an account? Login
        </button>
      </div>

      <AuthModal
          title="Confirm Your Email"
          message={`A verification email is being sent to ${email}. Please double check and confirm that it's correct.`}
          isOpen={showRegistrationPopup}
          onClose={() => setShowRegistrationPopup(false)}
          onConfirm={handleRegistrationConfirm}
          confirmButtonText="Confirm & Register"
        />
    </form>
  );
};