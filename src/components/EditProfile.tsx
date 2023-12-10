"use client"
import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Imagine } from "@/components/Imagine"
import { useUser } from "@/components/UserProvider"

type UserProfile = {
    nickname?: string;
    url?: string;
    bio?: string;
};

export const EditProfile = () => {
    const {userInfo} = useUser();

    const profile = {
        nickname: "",
        bio: "",
        url: "",
    }

    const [formData, setFormData] = useState<UserProfile>(profile);
    const [originalAvatar, setOriginalAvatar] = useState(userInfo.picture);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [liked, setLiked] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [scale, setScale] = useState(1);
    const editorRef = useRef<AvatarEditor | null>(null);

    // 編集項目の変更を反映
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    // 変更を保存
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalAvatar(reader.result as string); // 元の画像を更新
            setFormData((prev) => ({ ...prev, avatar: reader.result as string})); // 編集後の画像も更新
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSaveAvatar = () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImage();
            const canvasDataURL = canvas.toDataURL();
            setFormData((prev) => ({ ...prev, avatar: canvasDataURL }));
            setIsEditingAvatar(false);
            setScale(1);  // スケールをリセット
        }
    };

    const updateCanvas = () => {
        if (editorRef.current && editorRef.current.getImage) {
            const canvas = editorRef.current.getImage();
            const canvasDataURL = canvas.toDataURL();
            setFormData((prev) => ({ ...prev, avatar: canvasDataURL }));
        }
    };

    const copyToClickBoard = (content: string) => {
        navigator.clipboard.writeText(content)
            .then(() => {
                console.log("Text copied to clipboard...")
            })
            .catch(err => {
                console.log('Something went wrong', err);
            })
    }

    const formatUrlForDisplay = (url?: string) => {
        if (url) {
            return url.replace(/^https?:\/\//, '');
        }
    };
    return (
        <div className="pt-20 mx-auto container text-center">
            {/* プロフィール編集画面 */}
            {isEditing ? (
                <form onSubmit={handleSubmit} className="px-8">
                    <h2 className="text-xl">Edit</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Nickname</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">URL Link</span>
                        </label>
                        <input
                            type="url"
                            className="input input-bordered"
                            name="url"
                            placeholder='http://example.com'
                            value={formData.url}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Bio</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="form-control m-4 btn-group btn-group-vertical lg:btn-group-horizontal">
                        <button className="btn btn-primary">Save Changes</button>
                        <button className="btn btn-ghost border-neutral" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                // ... プレビュー表示 ...
                <>
                <div className="m-1 card card-bordered p-4 shadow-lg border-primary border-2">
                    <h1 className='text-accent text-2xl'>Profile</h1>
                    <div className='like favorite m-1'>
                        <label tabIndex={0} className="btn btn-ghost rounded-btn swap swap-rotate btn-sm text-2xl">
                            <input type="checkbox" checked={liked} onChange={() => setLiked(!liked)} />
                            <div className="swap-on">👎<div className="badge">-1</div></div>
                            <div className="swap-off">👍<div className="badge">+1</div></div>
                        </label>
                        <label tabIndex={0} className="btn btn-ghost rounded-btn swap swap-flip btn-sm text-2xl">
                            <input type="checkbox" checked={favorited} onChange={() => setFavorited(!favorited)} />
                            <div className="swap-on">❤️<div className="badge badge-secondary">+1</div></div>
                            <div className="swap-off">♡</div>
                        </label>
                    </div>

                    <Imagine priority={false} src={originalAvatar || `/avatar.png`} alt="avatar" width={150} height={150} className="m-4 mx-auto avatar rounded-full ring ring-primary"
                        onClick={() => { (window as any).my_modal_2.showModal(); updateCanvas(); }} />

                    <div className="flex items-center justify-center">
                        <h2 id="account" className="text-xl truncate">
                            {userInfo.account}
                        </h2>
                        <button className="btn-xs hover:bg-accent w-26 cursor-copy" onClick={() => {
                            const content = document.getElementById('account')?.textContent;
                            if (content) { copyToClickBoard(content); }
                        }}>Copy
                        </button>
                    </div>

                    <h3 id="name" className="text-lg">
                        {userInfo.name}
                    </h3>
                    <p>{userInfo.domain}</p>
                    <p>{userInfo.networkType}</p>
                    <p>{userInfo.networkEndpoint}</p>
                    <p>{userInfo.source}</p>
                    <p>{userInfo.token}</p>
                    <br/>
                    <p>{formData.nickname}</p>
                    <a href={formData.url} className="block underline">{formatUrlForDisplay(formData.url)}</a>
                    <p>{formData.bio}</p>
                    <button className="btn btn-secondary mt-4 mx-auto block normal-case" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                     {/* <NFT /> */}
                </div>
                </>
            )}
            {/* アバター編集モーダル */}
            <dialog id="my_modal_2" className="modal">
                <form method="dialog" className="modal-box w-sm h-auto flex flex-col items-center justify-center overflow-hidden">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    <h2 className="font-bold text-lg">Edit Avatar</h2>
                    <AvatarEditor
                        ref={editorRef}
                        image={originalAvatar || `/avatar.png`}
                        key={originalAvatar}
                        width={250}
                        height={250}
                        border={2}
                        color={[255, 255, 255, 0.6]}
                        scale={scale}
                        borderRadius={150}
                        className="object-contain m-4"
                        crossOrigin="anonymous"
                    />
                    <input
                        type="range"
                        value={scale}
                        min="0.5"
                        max="1.5"
                        step="0.01"
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full m-4"
                    />
                    <input
                        type="file"
                        className="file-input file-input-ghost w-[70%] max-w-xs m-2"
                        onChange={handleImageUpload}
                    />
                    <button onClick={handleSaveAvatar} className="btn btn-primary mt-4">Save Avatar</button>
                </form>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </div>
    )
}
