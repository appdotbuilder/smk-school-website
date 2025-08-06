
import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CreateStudentRegistrationInput } from '../../../server/src/schema';

export function RegistrationPage() {
  const [formData, setFormData] = useState<CreateStudentRegistrationInput>({
    full_name: '',
    date_of_birth: new Date(),
    gender: 'male',
    address: '',
    phone_number: '',
    email: '',
    parent_name: '',
    parent_phone: '',
    previous_school: '',
    desired_major: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);
    
    try {
      await trpc.createStudentRegistration.mutate(formData);
      setSubmitStatus('success');
      // Reset form
      setFormData({
        full_name: '',
        date_of_birth: new Date(),
        gender: 'male',
        address: '',
        phone_number: '',
        email: '',
        parent_name: '',
        parent_phone: '',
        previous_school: '',
        desired_major: ''
      });
    } catch (error) {
      console.error('Failed to submit registration:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: CreateStudentRegistrationInput) => ({
      ...prev,
      date_of_birth: new Date(e.target.value)
    }));
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          📝 Student Registration
        </h1>
        <p className="text-xl text-red-700 max-w-2xl mx-auto">
          Join SMK School and take the first step towards your technical career. 
          Fill out the form below to apply for admission.
        </p>
      </div>

      {submitStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            🎉 Registration submitted successfully! We'll review your application and contact you soon.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            ❌ Failed to submit registration. Please try again or contact our admissions office.
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardTitle className="flex items-center">
            <span className="mr-2">👨‍🎓</span>
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={formData.full_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateStudentRegistrationInput) => ({ 
                      ...prev, 
                      full_name: e.target.value 
                    }))
                  }
                  placeholder="Enter your full name"
                  required
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Date of Birth *
                </label>
                <Input
                  type="date"
                  value={formatDateForInput(formData.date_of_birth)}
                  onChange={handleDateChange}
                  required
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Gender *
                </label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: 'male' | 'female') =>
                    setFormData((prev: CreateStudentRegistrationInput) => ({ 
                      ...prev, 
                      gender: value 
                    }))
                  }
                >
                  <SelectTrigger className="border-red-200 focus:border-red-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateStudentRegistrationInput) => ({ 
                      ...prev, 
                      email: e.target.value 
                    }))
                  }
                  placeholder="your.email@example.com"
                  required
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateStudentRegistrationInput) => ({ 
                      ...prev, 
                      phone_number: e.target.value 
                    }))
                  }
                  placeholder="+62 xxx-xxxx-xxxx"
                  required
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Desired Major *
                </label>
                <Input
                  type="text"
                  value={formData.desired_major}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateStudentRegistrationInput) => ({ 
                      ...prev, 
                      desired_major: e.target.value 
                    }))
                  }
                  placeholder="e.g., Information Technology, Engineering"
                  required
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-red-800 mb-2">
                Address *
              </label>
              <Textarea
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev: CreateStudentRegistrationInput) => ({ 
                    ...prev, 
                    address: e.target.value 
                  }))
                }
                placeholder="Enter your complete address"
                required
                className="border-red-200 focus:border-red-500"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Parent/Guardian Name *
                </label>
                <Input
                  type="text"
                  value={formData.parent_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateStudentRegistrationInput) => ({ 
                      ...prev, 
                      parent_name: e.target.value 
                    }))
                  }
                  placeholder="Parent or guardian full name"
                  required
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Parent/Guardian Phone *
                </label>
                <Input
                  type="tel"
                  value={formData.parent_phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateStudentRegistrationInput) => ({ 
                      ...prev, 
                      parent_phone: e.target.value 
                    }))
                  }
                  placeholder="+62 xxx-xxxx-xxxx"
                  required
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-red-800 mb-2">
                Previous School *
              </label>
              <Input
                type="text"
                value={formData.previous_school}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateStudentRegistrationInput) => ({ 
                    ...prev, 
                    previous_school: e.target.value 
                  }))
                }
                placeholder="Name of your previous school"
                required
                className="border-red-200 focus:border-red-500"
              />
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                {isLoading ? '📤 Submitting...' : '🚀 Submit Registration'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
          <span className="mr-3">📋</span>
          Admission Requirements
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-red-700 mb-3">Required Documents:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center"><span className="mr-2">✓</span>Junior High School Certificate</li>
              <li className="flex items-center"><span className="mr-2">✓</span>Academic Transcripts</li>
              <li className="flex items-center"><span className="mr-2">✓</span>Birth Certificate</li>
              <li className="flex items-center"><span className="mr-2">✓</span>ID Card (KTP/KK)</li>
              <li className="flex items-center"><span className="mr-2">✓</span>Passport Photos (3x4 cm)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-700 mb-3">Application Process:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center"><span className="mr-2">1️⃣</span>Submit online registration</li>
              <li className="flex items-center"><span className="mr-2">2️⃣</span>Document verification</li>
              <li className="flex items-center"><span className="mr-2">3️⃣</span>Entrance examination</li>
              <li className="flex items-center"><span className="mr-2">4️⃣</span>Interview session</li>
              <li className="flex items-center"><span className="mr-2">5️⃣</span>Admission decision</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
