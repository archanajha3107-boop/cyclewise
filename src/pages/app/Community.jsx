import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { 
  collection, addDoc, onSnapshot, orderBy,
  query, serverTimestamp, doc, getDoc, updateDoc
} from 'firebase/firestore';

import Navbar from '../../components/Navbar';

const WEEKLY_TOPIC =
  'How do you explain PMOS to someone who doesn\'t understand?';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'communityPosts'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return unsub;
  }, []);

  async function handlePost() {
    if (!text.trim()) return;
    try {
      setPosting(true);
      await addDoc(collection(db, 'communityPosts'), {
        text: text.trim(),
        authorId: auth.currentUser?.uid,
        authorDisplay: anonymous
          ? 'Anonymous'
          : auth.currentUser?.displayName || 'CycleWise User',
        isAnonymous: anonymous,
        topic: WEEKLY_TOPIC,
        hearts: 0,
        hugs: 0,
        createdAt: serverTimestamp(),
      });
      setText('');
      setShowForm(false);
    } catch (error) {
      alert('Could not post. Please try again.');
    }
    setPosting(false);
  }

  async function handleReaction(postId, type) {
  try {
    const postRef = doc(db, 'communityPosts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const current = postSnap.data()[type] || 0;
      await updateDoc(postRef, { [type]: current + 1 });
    }
  } catch (error) {
    console.log('Reaction error:', error);
  }
}

  return (
    <div className="screen pb-24">

      {/* Header */}
      <h1 className="page-title mb-1">Community</h1>
      <p className="text-muted-rose text-sm mb-4">
        You are not alone here.
      </p>

      {/* Weekly Topic Banner */}
      <div className="bg-mauve rounded-2xl p-4 mb-4">
        <p className="text-xs text-white/70 uppercase tracking-wider mb-1">
          This week
        </p>
        <p className="text-white font-playfair text-base leading-snug">
          {WEEKLY_TOPIC}
        </p>
        <p className="text-white/60 text-xs mt-2">
          Week 21 · {posts.length} voices so far
        </p>
      </div>

      {/* Write Post Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary mb-4"
        >
          + Share your voice
        </button>
      )}

      {/* Post Form */}
      {showForm && (
        <div className="card mb-4 space-y-3">
          <p className="text-xs text-muted-rose italic">
            Responding to: {WEEKLY_TOPIC}
          </p>
          <textarea
            className="w-full bg-cream rounded-xl p-3 text-charcoal text-sm placeholder-muted-rose focus:outline-none focus:ring-2 focus:ring-mauve resize-none"
            rows={4}
            placeholder="Share your experience, your words, your truth. This community understands."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-rose">
              {text.length}/2000
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-rose">
                Anonymous
              </span>
              <button
                onClick={() => setAnonymous(!anonymous)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  anonymous ? 'bg-sage' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${
                    anonymous ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
          {anonymous && (
            <p className="text-xs text-muted-rose">
              Your name won't be shown.
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={posting || !text.trim()}
              className="btn-primary flex-1"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-3">
        {posts.length === 0 && (
          <div className="card text-center">
            <p className="text-muted-rose text-sm">
              Be the first to share your voice this week.
            </p>
          </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-mauve">
                {post.authorDisplay}
              </span>
              <span className="text-xs text-muted-rose">
                {post.createdAt?.toDate
                  ? new Date(
                      post.createdAt.toDate()
                    ).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : 'Just now'}
              </span>
            </div>
            <p className="text-charcoal text-sm leading-relaxed">
              {post.text}
            </p>
            <div className="flex gap-4 pt-1">
  <button
    onClick={() => handleReaction(post.id, 'hearts')}
    className="flex items-center gap-1 text-xs text-muted-rose hover:text-terra transition-colors"
  >
    ❤️ {post.hearts || 0}
  </button>
  <button
    onClick={() => handleReaction(post.id, 'hugs')}
    className="flex items-center gap-1 text-xs text-muted-rose hover:text-mauve transition-colors"
  >
    🤗 {post.hugs || 0}
  </button>
</div>
          </div>
        ))}
      </div>

      <Navbar />
    </div>
  );
}