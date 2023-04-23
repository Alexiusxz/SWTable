import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css'
import { useDispatch } from 'react-redux';
import { addPerson } from '../../slices/peopleSlice';

type FormData = {
  name: string;
  height: number | string;
  mass: number | string;
  hair_color: string;
  skin_color: string;
};

const MyForm: React.FC = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isValid) {
      setButtonStyle({});
    }
  }, [isValid]);
  
  const handleMouseEnter = () => {
    if (!isValid) {
      const buttonWidth = 100;
      const buttonHeight = 40;
      const x = Math.random() * (window.innerWidth - buttonWidth);
      const y = Math.random() * (window.innerHeight - buttonHeight);
      setButtonStyle({ left: `${x}px`, top: `${y}px`, position: 'fixed' });
    }
  };

  const onSubmit = (formData: FormData) => {
    dispatch(addPerson(formData));
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {submitted && <div className={styles.successMessage}>Форма успешно заполнена!</div>}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input {...register('name', { required: true, minLength: 2 })} placeholder="Name" />
        {errors.name?.type === "required" && (
          <span className={styles.error}>Name is required</span>
        )}
        {errors.name?.type === "minLength" && (
          <span className={styles.error}>
            Name must be at least 2 characters
          </span>
        )}

        <input {...register('height', { required: true, minLength: 2 })} placeholder="Height" />
        {errors.height?.type === "required" && (
          <span className={styles.error}>Height is required</span>
        )}
        {errors.height?.type === "minLength" && (
          <span className={styles.error}>
            Height must be at least 2 characters
          </span>
        )}

        <input {...register('mass', { required: true, minLength: 2 })} placeholder="Mass" />
        {errors.mass?.type === "required" && (
          <span className={styles.error}>Mass is required</span>
        )}
        {errors.mass?.type === "minLength" && (
          <span className={styles.error}>
            Mass must be at least 2 characters
          </span>
        )}

        <input {...register('hair_color', { required: true, minLength: 2 })} placeholder="Hair Color" />
        {errors.hair_color?.type === "required" && (
          <span className={styles.error}>Hair Color is required</span>
        )}
        {errors.hair_color?.type === "minLength" && (
          <span className={styles.error}>
            Hair Color must be at least 2 characters
          </span>
        )}

        <input {...register('skin_color', { required: true, minLength: 2 })} placeholder="Skin Color" />
        {errors.skin_color?.type === "required" && (
          <span className={styles.error}>Skin Color is required</span>
        )}
        {errors.skin_color?.type === "minLength" && (
          <span className={styles.error}>
            Skin Color must be at least 2 characters
          </span>
        )}

        <button
          type="submit"
          className={styles.button}
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
        >
          Отправить
        </button>
      </form>
    </div>
  );
};

export default MyForm;