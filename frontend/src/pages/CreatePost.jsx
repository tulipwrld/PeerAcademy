import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',        // Добавлено поле для имени поста
        text: '',
        images: [],
        tags: []         // Добавлено поле для тегов
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const fileInputRef = useRef(null);

    const MAX_NAME_LENGTH = 100;      // Максимальная длина имени
    const MAX_TEXT_LENGTH = 3000;
    const MAX_IMAGES = 2;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    // Варианты тегов
    const AVAILABLE_TAGS = [
        { id: 'programming', name: 'Программирование', emoji: '💻', color: '#4CAF50' },
        { id: 'mathematics', name: 'Математика', emoji: '📐', color: '#2196F3' },
        { id: 'science', name: 'Наука', emoji: '🔬', color: '#9C27B0' },
        { id: 'art', name: 'Искусство', emoji: '🎨', color: '#FF9800' },
        { id: 'music', name: 'Музыка', emoji: '🎵', color: '#E91E63' },
        { id: 'languages', name: 'Языки', emoji: '🗣️', color: '#00BCD4' },
        { id: 'business', name: 'Бизнес', emoji: '💼', color: '#FFC107' },
        { id: 'health', name: 'Здоровье', emoji: '💪', color: '#8BC34A' },
        { id: 'technology', name: 'Технологии', emoji: '🤖', color: '#3F51B5' },
        { id: 'philosophy', name: 'Философия', emoji: '🧠', color: '#795548' },
        { id: 'history', name: 'История', emoji: '📜', color: '#CDDC39' },
        { id: 'sports', name: 'Спорт', emoji: '⚽', color: '#FF5722' }
    ];

    // Проверка аутентификации при загрузке страницы
    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("🔄 Checking authentication...");
                const response = await fetch('/api/auth/check/profile', {
                    credentials: 'include'
                });
                
                console.log("📨 Auth response status:", response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("✅ User authenticated:", data.name);
                    setAuthChecked(true);
                } else {
                    console.log("❌ Not authenticated, redirecting to login");
                    navigate('/login');
                }
            } catch (error) {
                console.error('🚨 Error checking auth:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        
        checkAuth();
    }, [navigate]);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        if (newName.length <= MAX_NAME_LENGTH) {
            setFormData(prev => ({ ...prev, name: newName }));
            if (errors.name) {
                setErrors(prev => ({ ...prev, name: '' }));
            }
        }
    };

    const handleTextChange = (e) => {
        const newText = e.target.value;
        if (newText.length <= MAX_TEXT_LENGTH) {
            setFormData(prev => ({ ...prev, text: newText }));
            if (errors.text) {
                setErrors(prev => ({ ...prev, text: '' }));
            }
        }
    };

    const handleTagToggle = (tagId) => {
        setFormData(prev => {
            const newTags = prev.tags.includes(tagId)
                ? prev.tags.filter(t => t !== tagId)
                : [...prev.tags, tagId];
            
            // Максимум 5 тегов
            if (newTags.length > 5) {
                setErrors(prev => ({ ...prev, tags: 'Максимум 5 тегов' }));
                return prev;
            }
            
            if (errors.tags) {
                setErrors(prev => ({ ...prev, tags: '' }));
            }
            
            return { ...prev, tags: newTags };
        });
    };

    const validateImages = (files) => {
        const newErrors = [];
        
        if (formData.images.length + files.length > MAX_IMAGES) {
            newErrors.push(`Максимум ${MAX_IMAGES} фото`);
            return newErrors;
        }

        for (let file of files) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                newErrors.push(`Файл "${file.name}" имеет неподдерживаемый формат. Разрешены: JPG, PNG, GIF, WEBP`);
                continue;
            }
            
            if (file.size > MAX_FILE_SIZE) {
                newErrors.push(`Файл "${file.name}" превышает 5MB`);
                continue;
            }
        }
        
        return newErrors;
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const validationErrors = validateImages(files);
        
        if (validationErrors.length > 0) {
            setErrors(prev => ({ ...prev, images: validationErrors }));
            return;
        }

        setErrors(prev => ({ ...prev, images: '' }));
        
        const newImages = [...formData.images, ...files];
        setFormData(prev => ({ ...prev, images: newImages }));
        
        const newPreviews = [...imagePreviews];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                setImagePreviews([...newPreviews]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
        setImagePreviews(newPreviews);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Название поста обязательно';
        } else if (formData.name.length > MAX_NAME_LENGTH) {
            newErrors.name = `Название не может превышать ${MAX_NAME_LENGTH} символов`;
        }
        
        if (!formData.text.trim()) {
            newErrors.text = 'Текст обязателен для заполнения';
        } else if (formData.text.length > MAX_TEXT_LENGTH) {
            newErrors.text = `Текст не может превышать ${MAX_TEXT_LENGTH} символов`;
        }
        
        if (formData.images.length > MAX_IMAGES) {
            newErrors.images = `Максимум ${MAX_IMAGES} фото`;
        }
        
        if (formData.tags.length === 0) {
            newErrors.tags = 'Выберите хотя бы один тег';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const submitData = new FormData();
            
            // Добавляем имя поста
            submitData.append('name', formData.name);
            // Добавляем текст
            submitData.append('statement', formData.text);
            // Добавляем теги (отправляем как JSON строку)
            submitData.append('tags', JSON.stringify(formData.tags));
            
            // Добавляем фото
            formData.images.forEach((image) => {
                submitData.append('images', image);
            });
            
            console.log('📤 Sending post...');
            console.log('Name:', formData.name);
            console.log('Statement:', formData.text);
            console.log('Tags:', formData.tags);
            console.log('Images count:', formData.images.length);
            
            // Отправляем запрос
            const response = await fetch('/api/statements/post', {
                method: 'POST',
                credentials: 'include',
                body: submitData
            });
            
            console.log('📨 Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Post created successfully:', data);
                navigate('/profile');
            } else if (response.status === 401) {
                console.log('❌ Not authorized');
                navigate('/login');
            } else if (response.status === 422) {
                const errorData = await response.json();
                console.error('❌ Validation error:', errorData);
                
                if (errorData.detail && Array.isArray(errorData.detail)) {
                    const formattedErrors = {};
                    errorData.detail.forEach(err => {
                        const field = err.loc[err.loc.length - 1];
                        formattedErrors[field] = err.msg;
                    });
                    setErrors(formattedErrors);
                } else if (errorData.detail) {
                    setErrors({ submit: typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail) });
                } else {
                    setErrors({ submit: 'Ошибка валидации данных' });
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                setErrors({ 
                    submit: errorData.message || errorData.error || errorData.detail || 'Ошибка при создании поста' 
                });
            }
        } catch (error) {
            console.error('🚨 Network error:', error);
            setErrors({ submit: 'Ошибка соединения с сервером. Проверьте подключение.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const remainingNameChars = MAX_NAME_LENGTH - formData.name.length;
    const remainingTextChars = MAX_TEXT_LENGTH - formData.text.length;

    const renderError = (error) => {
        if (!error) return null;
        if (typeof error === 'string') return error;
        if (Array.isArray(error)) return error.join(', ');
        if (typeof error === 'object') {
            try {
                return JSON.stringify(error);
            } catch {
                return 'Ошибка валидации';
            }
        }
        return String(error);
    };

    // Показываем загрузку пока проверяем аутентификацию
    if (loading) {
        return (
            <div className="create-post-container">
                <div className="create-post-card">
                    <div className="loading">
                        <p>Loading...</p>
                        <p>Checking authentication...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Если не авторизован - редирект (хотя useEffect уже делает редирект)
    if (!authChecked) {
        return null;
    }

    return (
        <div className="create-post-container">
            <div className="create-post-card">
                <h2 className="create-post-title">Создать пост</h2>
                
                <form onSubmit={handleSubmit} className="create-post-form">
                    {/* Поле для имени поста */}
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Название поста <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleNameChange}
                            placeholder="Введите название поста..."
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                        <div className="input-footer">
                            <span className={`char-counter ${remainingNameChars < 20 ? 'warning' : ''}`}>
                                {remainingNameChars} / {MAX_NAME_LENGTH}
                            </span>
                            {errors.name && (
                                <span className="error-message">{renderError(errors.name)}</span>
                            )}
                        </div>
                    </div>
                    
                    {/* Поле для текста поста */}
                    <div className="form-group">
                        <label htmlFor="text" className="form-label">
                            Текст поста <span className="required">*</span>
                        </label>
                        <textarea
                            id="text"
                            name="text"
                            value={formData.text}
                            onChange={handleTextChange}
                            placeholder="Напишите что-нибудь..."
                            className={`form-textarea ${errors.text ? 'error' : ''}`}
                            rows="8"
                            disabled={isSubmitting}
                        />
                        <div className="textarea-footer">
                            <span className={`char-counter ${remainingTextChars < 100 ? 'warning' : ''}`}>
                                {remainingTextChars} / {MAX_TEXT_LENGTH}
                            </span>
                            {errors.text && (
                                <span className="error-message">{renderError(errors.text)}</span>
                            )}
                        </div>
                    </div>
                    
                    {/* Выбор тегов */}
                    <div className="form-group">
                        <label className="form-label">
                            Теги <span className="required">*</span>
                            <span className="tag-hint">(выберите до 5 тегов)</span>
                        </label>
                        
                        <div className="tags-grid">
                            {AVAILABLE_TAGS.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.id)}
                                    className={`tag-button ${formData.tags.includes(tag.id) ? 'selected' : ''}`}
                                    style={{
                                        borderColor: formData.tags.includes(tag.id) ? tag.color : '#ddd',
                                        backgroundColor: formData.tags.includes(tag.id) ? `${tag.color}10` : 'white'
                                    }}
                                    disabled={isSubmitting}
                                >
                                    <span className="tag-emoji">{tag.emoji}</span>
                                    <span className="tag-name">{tag.name}</span>
                                    {formData.tags.includes(tag.id) && (
                                        <span className="tag-check">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        
                        {errors.tags && (
                            <div className="error-message">{renderError(errors.tags)}</div>
                        )}
                        
                        <div className="selected-tags-info">
                            Выбрано тегов: {formData.tags.length}/5
                        </div>
                    </div>
                    
                    {/* Загрузка фото */}
                    <div className="form-group">
                        <label className="form-label">
                            Фото (до 2, необязательно)
                        </label>
                        
                        <div className="image-upload-area">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="upload-button"
                                disabled={isSubmitting || formData.images.length >= MAX_IMAGES}
                            >
                                <span className="upload-icon">📸</span>
                                <span>Выбрать фото</span>
                                <span className="upload-hint">
                                    {formData.images.length}/{MAX_IMAGES} фото
                                </span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                multiple
                                onChange={handleImageSelect}
                                style={{ display: 'none' }}
                                disabled={isSubmitting}
                            />
                            <p className="upload-info">
                                Поддерживаются форматы: JPG, PNG, GIF, WEBP. Максимум 5MB на файл
                            </p>
                        </div>
                        
                        {errors.images && (
                            <div className="error-message">
                                {Array.isArray(errors.images) 
                                    ? errors.images.map((err, idx) => <div key={idx}>{renderError(err)}</div>)
                                    : renderError(errors.images)}
                            </div>
                        )}
                        
                        {imagePreviews.length > 0 && (
                            <div className="image-previews">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="image-preview-item">
                                        <img src={preview} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => removeImage(index)}
                                            disabled={isSubmitting}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {errors.submit && (
                        <div className="submit-error">
                            {renderError(errors.submit)}
                        </div>
                    )}
                    
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="cancel-button"
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
