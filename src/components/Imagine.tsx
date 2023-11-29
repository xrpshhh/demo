import Image from 'next/image';

type ImagineProps = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    quality?: number;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
    placeholder?: 'empty' | 'blur';
    className?: string;
    onClick?: () => void;
};
type ImageLoaderProps = {
    src: string;
    width: number;
    quality?: number;
};

export const Imagine: React.FC<ImagineProps> = ({
    src,
    alt,
    width,
    height,
    quality = 75,
    priority = false,
    fill = false,
    sizes,
    placeholder,
    className,
    onClick,
}) => {
    const imageLoader = ({ src, width, quality = 75 }: ImageLoaderProps) => {
        const MAX_WIDTH = 640;
        const resizeWidth = width > MAX_WIDTH ? MAX_WIDTH : width;
        // webpにしてリサイズ
        return `${src}?w=${resizeWidth}&q=${quality}&fm=webp`;
    };

    return (
        <>{fill ? (
            <div onClick={onClick} className={className + 'relative'}>
            <Image
                loader={imageLoader}
                src={src}
                alt={alt}
                width={width}
                height={height}
                quality={quality}
                priority={priority}
                fill={fill}
                sizes={sizes}
                placeholder={placeholder}
                className={'object-contain hover:scale-105'}
            />
        </div>
        ) : (
            <Image
                loader={imageLoader}
                src={src}
                alt={alt}
                width={width}
                height={height}
                quality={quality}
                priority={priority}
                fill={fill}
                sizes={sizes}
                placeholder={placeholder}
                onClick={onClick}
                className={className + 'object-contain hover:scale-105 cursor-pointer'}
            />
        )}
        </>
    )
}
