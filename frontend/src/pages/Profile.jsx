// import React, { useState, useEffect } from 'react';
// // import Header from './Header'
// import './Profile.css';

// const Profile = () => {
//     const [userData, setUserData] = useState(null);
//     const [interviews, setInterviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [authChecked, setAuthChecked] = useState(false);

//     useEffect(() => {
//         const initializeData = async () => {
//             await fetchUserData();
//         };
//         initializeData();
//     }, []);

//     // Загружаем интервью после того как получили userData
//     useEffect(() => {
//         if (authChecked && userData) {
//             fetchInterviews();
//         }
//     }, [authChecked, userData]);

//     const fetchUserData = async () => {
//         try {
//             console.log("🔄 Checking authentication...");
//             const response = await fetch('http://localhost:8000/api/auth/check/profile', {
//                 credentials: 'include'
//             });
            
//             console.log("📨 Auth response status:", response.status);
            
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("✅ User data:", data);
//                 setUserData(data);
//                 setAuthChecked(true);
                
//                 // Если интервью приходят с userData, используем их
//                 if (data.interviews) {
//                     setInterviews(data.interviews);
//                     setLoading(false);
//                 }
//             } 
//             else {
//                 console.log("❌ Not authenticated, redirecting to login");
//                 window.location.href = '/login';
//             }
//         } 
//         catch (error) {
//             console.error('🚨 Error fetching user data:', error);
//             window.location.href = '/login';
//         }
//     };

//     const fetchInterviews = async () => {
//         try {
//             console.log("🔄 Fetching interviews...");
            
//             // Если интервью уже получили из userData, не делаем лишний запрос
//             if (userData && userData.interviews) {
//                 console.log("✅ Interviews already in user data");
//                 setLoading(false);
//                 return;
//             }
            
//             const response = await fetch('/api/interviews', {
//                 credentials: 'include'
//             });
            
//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("✅ Interviews data:", data);
//                 setInterviews(data);
//             } else {
//                 console.log("❌ Failed to fetch interviews");
//             }
//         } catch (error) {
//             console.error('🚨 Error fetching interviews:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Показываем loading до тех пор, пока не проверим аутентификацию И не загрузим данные
//     if (loading || !authChecked) {
//         return (
//             <div className="profile-container">
//                 <div className="loading">
//                     <p>Loading...</p>
//                     <p>Checking authentication...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Если аутентификация проверена, но userData нет - редирект
//     if (authChecked && !userData) {
//         console.log("🔄 Redirecting to login - no user data");
//         window.location.href = '/login';
//         return null;
//     }

//     console.log("🎉 Rendering profile for:", userData.name);

//     return (
//         <div className="profile-container">
//             {/* <Header /> */}
//             <div className="profile-header">
//                 <div className="user-info-card">
//                     <img
//                         src={userData.picture || '/default-avatar.png'} 
//                         alt="Avatar" 
//                         className="user-avatar"
//                     />
//                     <h2 className="user-name">{userData.name}</h2>
//                     <p className="user-email">{userData.email}</p>
                    
//                     {/* Добавлен блок с описанием */}
//                     {userData.description && (
//                         <div className="user-description">
//                             <h3 className="description-title">О себе</h3>
//                             <p className="description-text">{userData.description}</p>
//                         </div>
//                     )}
                    
//                     <div className="user-grade">
//                         {/* <span className="grade-badge">
//                             {userData.grade} {/* || 'Junior'
//                         </span> */}
//                     </div>
//                 </div>
//             </div>

//             <div className="profile-content">
//                 {/* <div className="interviews-section">
//                     <h3 className="section-title">Мои интервью</h3>
                    
//                     {interviews.length === 0 ? (
//                         <div className="empty-state">
//                             <div className="empty-icon">📝</div>
//                             <h4>Тут пока пусто</h4>
//                             <p>Здесь будут отображаться ваши завершенные нейро-интервью</p>
//                         </div>
//                     ) : (
//                         <div className="interviews-grid">
//                             {interviews.map((interview, index) => (
//                                 <div key={interview.id || index} className="interview-card">
//                                     <div className="interview-header">
//                                         <span className="interview-date">
//                                             {new Date(interview.date).toLocaleDateString()}
//                                         </span>
//                                         <span className={`interview-status ${interview.status}`}>
//                                             {interview.status}
//                                         </span>
//                                     </div>
//                                     <h4 className="interview-title">{interview.title}</h4>
//                                     <p className="interview-description">
//                                         {interview.description}
//                                     </p>
//                                     <div className="interview-footer">
//                                         <span className="interview-score">
//                                             Оценка: {interview.score}/100
//                                         </span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div> */}

//                 {/* <div className="stats-section">
//                     <h3 className="section-title">Статистика</h3>
//                     <div className="stats-grid">
//                         <div className="stat-card">
//                             <span className="stat-number">{interviews.length}</span>
//                             <span className="stat-label">Всего интервью</span>
//                         </div>
//                         <div className="stat-card">
//                             <span className="stat-number">
//                                 {interviews.filter(i => i.status === 'completed').length}
//                             </span>
//                             <span className="stat-label">Завершено</span>
//                         </div>
//                         <div className="stat-card">
//                             <span className="stat-number">
//                                 {interviews.length > 0 
//                                     ? Math.round(interviews.reduce((acc, i) => acc + (i.score || 0), 0) / interviews.length)
//                                     : 0
//                                 }
//                             </span>
//                             <span className="stat-label">Средний балл</span>
//                         </div> */}
//                     {/* </div> */}
//                 {/* </div> */}
//             </div>
//         </div>
//     );
// };

// export default Profile;























import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: ''
    });
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        const initializeData = async () => {
            await fetchUserData();
        };
        initializeData();
    }, []);

    // Загружаем интервью после того как получили userData
    useEffect(() => {
        if (authChecked && userData) {
            fetchInterviews();
        }
    }, [authChecked, userData]);

    const fetchUserData = async () => {
        try {
            console.log("🔄 Checking authentication...");
            const response = await fetch('/api/auth/check/profile', {
                credentials: 'include'
            });
            
            console.log("📨 Auth response status:", response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log("✅ User data:", data);
                setUserData(data);
                setAuthChecked(true);
                
                // Заполняем форму редактирования текущими данными
                setEditForm({
                    name: data.name || '',
                    description: data.description || ''
                });
                
                // Если интервью приходят с userData, используем их
                if (data.interviews) {
                    setInterviews(data.interviews);
                    setLoading(false);
                }
            } 
            else {
                console.log("❌ Not authenticated, redirecting to login");
                window.location.href = '/login';
            }
        } 
        catch (error) {
            console.error('🚨 Error fetching user data:', error);
            window.location.href = '/login';
        }
    };

    const fetchInterviews = async () => {
        try {
            console.log("🔄 Fetching interviews...");
            
            // Если интервью уже получили из userData, не делаем лишний запрос
            if (userData && userData.interviews) {
                console.log("✅ Interviews already in user data");
                setLoading(false);
                return;
            }
            
            const response = await fetch('/api/interviews', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log("✅ Interviews data:", data);
                setInterviews(data);
            } else {
                console.log("❌ Failed to fetch interviews");
            }
        } catch (error) {
            console.error('🚨 Error fetching interviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setSaveStatus('');
        // Заполняем форму текущими данными
        setEditForm({
            name: userData.name || '',
            description: userData.description || ''
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSaveStatus('');
        // Восстанавливаем исходные данные
        setEditForm({
            name: userData.name || '',
            description: userData.description || ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setSaveStatus('saving');
            
            const response = await fetch('/api/auth/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: editForm.name,
                    description: editForm.description
                })
            });

            if (response.ok) {
                const updatedData = await response.json();
                setUserData(updatedData);
                setIsEditing(false);
                setSaveStatus('success');
                
                // Показываем сообщение об успехе на 3 секунды
                setTimeout(() => {
                    setSaveStatus('');
                }, 3000);
            } else {
                setSaveStatus('error');
                setTimeout(() => {
                    setSaveStatus('');
                }, 3000);
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setSaveStatus('error');
            setTimeout(() => {
                setSaveStatus('');
            }, 3000);
        }
    };

    // Показываем loading до тех пор, пока не проверим аутентификацию И не загрузим данные
    if (loading || !authChecked) {
        return (
            <div className="profile-container">
                <div className="loading">
                    <p>Loading...</p>
                    <p>Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Если аутентификация проверена, но userData нет - редирект
    if (authChecked && !userData) {
        console.log("🔄 Redirecting to login - no user data");
        window.location.href = '/login';
        return null;
    }

    console.log("🎉 Rendering profile for:", userData.name);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="user-info-card">
                    <img
                        src={userData.picture || '/default-avatar.png'} 
                        alt="Avatar" 
                        className="user-avatar"
                    />
                    
                    {!isEditing ? (
                        // Режим просмотра
                        <>
                            <h2 className="user-name">{userData.name}</h2>
                            <p className="user-email">{userData.email}</p>
                            
                            {userData.description && (
                                <div className="user-description">
                                    <h3 className="description-title">О себе</h3>
                                    <p className="description-text">{userData.description}</p>
                                </div>
                            )}
                            
                            <button 
                                className="edit-profile-btn"
                                onClick={handleEditClick}
                            >
                                ✏️ Редактировать профиль
                            </button>
                        </>
                    ) : (
                        // Режим редактирования
                        <div className="edit-profile-form">
                            <h3 className="edit-title">Редактирование профиля</h3>
                            
                            <div className="form-group">
                                <label htmlFor="name">Имя</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleInputChange}
                                    placeholder="Введите ваше имя"
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="description">О себе</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleInputChange}
                                    placeholder="Расскажите о себе"
                                    className="form-textarea"
                                    rows="4"
                                />
                            </div>
                            
                            {saveStatus === 'saving' && (
                                <div className="save-status saving">
                                    Сохранение...
                                </div>
                            )}
                            
                            {saveStatus === 'success' && (
                                <div className="save-status success">
                                    ✓ Профиль успешно обновлен!
                                </div>
                            )}
                            
                            {saveStatus === 'error' && (
                                <div className="save-status error">
                                    ✗ Ошибка при сохранении. Попробуйте снова.
                                </div>
                            )}
                            
                            <div className="edit-buttons">
                                <button 
                                    className="save-btn"
                                    onClick={handleSaveProfile}
                                    disabled={saveStatus === 'saving'}
                                >
                                    💾 Сохранить
                                </button>
                                <button 
                                    className="cancel-btn"
                                    onClick={handleCancelEdit}
                                    disabled={saveStatus === 'saving'}
                                >
                                    ❌ Отмена
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="user-grade">
                        {/* <span className="grade-badge">
                            {userData.grade}
                        </span> */}
                    </div>
                </div>
            </div>

            <div className="profile-content">
                {/* Остальной контент профиля */}
            </div>
        </div>
    );
};

export default Profile;
