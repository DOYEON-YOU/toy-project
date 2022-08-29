import React from 'react';

const Tweet = (id, edit, tweet, setContent) => {
  return (
    <div className={`tweetContent`} key={id}>
      {edit ? (
        <textarea
          key={id}
          defaultValue={tweet}
          onChange={e => setContent(e.target.value)}></textarea>
      ) : (
        tweet
      )}
    </div>
  );
};

export default Tweet;
