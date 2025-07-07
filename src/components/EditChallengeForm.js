import { useState, useRef, useEffect } from 'react';
import useApiHandler from '../useApiHandler';
import TipTap from './TipTap';

function EditChallengeForm({ challenge }) {
  const [title, setTitle] = useState(challenge.title);
  const description = challenge.description;
  const [solution, setSolution] = useState(challenge.solution);
  const [message, setMessage] = useState('');
  const { request: put, error} = useApiHandler('challenges', 'PUT');
  const { request: post } = useApiHandler('uploads/challengeImage', 'POST');
  const tiptapRef = useRef();
  const BASEURL = process.env.REACT_APP_URL || 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const challengeId = challenge._id;
    const doc = tiptapRef.current.getJSON();
    const blobMap = tiptapRef.current.getBlobMap(); 

    for (const [blobUrl, file] of blobMap.entries()) {
      const form = new FormData();
      form.append('file', file);
      form.append('challengeId', challengeId);

      const result = await post(form);

      replaceSrcInDoc(doc, blobUrl, `${BASEURL}/${result.url}`);
    }

    const result = await put({
      challengeId,
      title,
      description: doc,
      solution,
    });
    if (result) {
      for (const [blobUrl] of blobMap.entries()) {
        URL.revokeObjectURL(blobUrl);
      }
      blobMap.clear();
      setMessage('Challenge Updated!')
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
      <h2 className="text-2xl font-semibold text-center mb-6">Update Challenge</h2>
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={challenge.title}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <div className="dark:bg-gray-900">
            <TipTap
              ref={tiptapRef}
              content={description}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Solution</label>
          <input
            id="solution"
            type="text"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900"
          />
        </div>

        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded">
          Update
        </button>

        {message && (
          <div className="mt-4 text-sm text-blue-700 bg-blue-100 px-4 py-2 rounded">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default EditChallengeForm;
