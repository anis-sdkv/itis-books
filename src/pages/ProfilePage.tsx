import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {User, Mail, AtSign, Save, Loader2} from 'lucide-react';
import {useAuth} from "@/context/useAuth";
import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';


interface EditableFields {
    firstName: string;
    lastName: string;
}


const ProfilePage = () => {
    const {user, updateProfile, logout} = useAuth()
    const navigate = useNavigate();

    const [editableFields, setEditableFields] = useState<EditableFields>({
        firstName: user?.first_name || '',
        lastName: user?.last_name || ''
    });

    useEffect(() => {
        setEditableFields({
            firstName: user?.first_name || '',
            lastName: user?.last_name || ''
        });
    }, [user]);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [message, setMessage] = useState({type: '', text: ''});

    const handleInputChange = (field: keyof EditableFields, value: string): void => {
        setEditableFields(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage({type: '', text: ''});

        try {
            await updateProfile({
                first_name: editableFields.firstName,
                last_name: editableFields.lastName,
            })

            setMessage({
                type: 'success',
                text: 'Профиль успешно обновлен!'
            });
        } catch (error: unknown) {
            console.log(error)
            setMessage({
                type: 'error',
                text: 'Ошибка при сохранении профиля. Попробуйте еще раз.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            logout();
            navigate('/auth/login');
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const hasChanges: boolean =
        editableFields.firstName !== user?.first_name ||
        editableFields.lastName !== user?.last_name;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Профиль пользователя</h1>
                        <p className="text-slate-600">Управляйте своими личными данными</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Выход...
                            </>
                        ) : (
                            'Выйти'
                        )}
                    </Button>
                </div>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <User className="h-6 w-6 text-blue-600"/>
                            </div>
                            <div>
                                <CardTitle className="text-xl">Личная информация</CardTitle>
                                <CardDescription>
                                    Обновите свои данные ниже
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Email - только для чтения */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                <Mail className="h-4 w-4"/>
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={user?.email}
                                disabled
                                className="bg-slate-50 cursor-not-allowed"
                            />
                        </div>

                        {/* Login - только для чтения */}
                        <div className="space-y-2">
                            <Label htmlFor="login" className="flex items-center gap-2 text-sm font-medium">
                                <AtSign className="h-4 w-4"/>
                                Логин
                            </Label>
                            <Input
                                id="login"
                                value={user?.username}
                                disabled
                                className="bg-slate-50 cursor-not-allowed"
                            />
                        </div>

                        {/* Имя - редактируемое */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium">
                                Имя
                            </Label>
                            <Input
                                id="firstName"
                                value={editableFields.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                placeholder="Введите ваше имя"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Фамилия - редактируемое */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium">
                                Фамилия
                            </Label>
                            <Input
                                id="lastName"
                                value={editableFields.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                placeholder="Введите вашу фамилию"
                                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Сообщения */}
                        {message.text && (
                            <Alert
                                className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                                <AlertDescription
                                    className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                                    {message.text}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Кнопка сохранения */}
                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={!hasChanges || isLoading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Сохранение...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4"/>
                                        Сохранить изменения
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Дополнительная информация */}
                <div className="mt-6 text-sm text-slate-500 bg-white/50 rounded-lg p-4">
                    <p className="font-medium mb-1">Примечание:</p>
                    <p>Email и логин нельзя изменить. Для изменения этих данных обратитесь к администратору.</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;