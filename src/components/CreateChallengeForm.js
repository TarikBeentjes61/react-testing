import { useState, useRef, useEffect } from 'react';
import useApiHandler from '../useApiHandler';
import TipTap from './TipTap';
import { useNavigate } from 'react-router-dom';

function CreateChallengeForm() {
  const [title, setTitle] = useState('');
  const [solution, setSolution] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { request: post, error } = useApiHandler('challenges', 'POST');
  const { request: postImage } = useApiHandler('uploads/challengeImage', 'POST');
  const { request: put } = useApiHandler('challenges', 'PUT');
  const tiptapRef = useRef();
  const BASEURL = process.env.REACT_APP_URL || 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const doc = tiptapRef.current.getJSON();
    const blobMap = tiptapRef.current.getBlobMap(); 

    const challenge = await post({
      title,
      description: doc,
      solution,
    });

    if (challenge) {
      const challengeId = challenge.insertedId;
      for (const [blobUrl, file] of blobMap.entries()) {
          const form = new FormData();
          form.append('file', file);
          form.append('challengeId', challengeId);

          const result = await postImage(form);

          replaceSrcInDoc(doc, blobUrl, `${BASEURL}/${result.url}`);
      }
      const result = await put({
        challengeId,
        title,
        description: doc,
        solution
      });

      if (result) {
        for (const [blobUrl] of blobMap.entries()) {
          URL.revokeObjectURL(blobUrl);
        }
        blobMap.clear();
        navigate(`/challenges/${challengeId}`);
      }
    }
  };

  const replaceSrcInDoc = (node, oldSrc, newSrc) => {
      if (node.type === 'image' && node.attrs?.src === oldSrc) {
        node.attrs.src = newSrc;
      }
      if (node.content) {
        node.content.forEach((child) => replaceSrcInDoc(child, oldSrc, newSrc));
      }
  };

  useEffect(() => {
    if (error) setMessage(error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 dark:text-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Create Challenge</h2>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <div className="dark:bg-gray-900">
            <TipTap
              ref={tiptapRef}
            />
          </div>
        </div>

        <div>
          <label htmlFor="solution" className="block font-medium mb-1">
            Solution
          </label>
          <input
            id="solution"
            type="text"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Enter solution"
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition"
        >
          Submit
        </button>

        {message && (
          <div className="mt-4 text-center text-sm text-blue-700 bg-blue-100 dark:bg-gray-800 dark:text-blue-300 px-4 py-2 rounded">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateChallengeForm;
