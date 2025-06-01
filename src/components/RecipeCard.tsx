import Image from 'next/image';
import styles from './RecipeCard.module.css';

interface RecipeCardProps {
	title: string;
	imageUrl?: string;
	onClick: () => void;
}

export default function RecipeCard({ title, imageUrl, onClick }: RecipeCardProps) {
	return (
		<div className={styles.card} onClick={onClick}>
			{imageUrl && (
				<div className={styles.imageContainer}>
					<Image
						src={imageUrl}
						alt={title}
						width={300}
						height={200}
						className={styles.image}
					/>
				</div>
			)}
			<h3 className={styles.title}><span>{title}</span></h3>
		</div>
	);
} 