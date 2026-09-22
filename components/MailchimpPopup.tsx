export function MailchimpPopup() {
  return (
    <script
      id="mcjs"
      dangerouslySetInnerHTML={{
        __html: `!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/97da1eaf8eb27643181d3a91c/af316ffa17a26dc1fe77a21e0.js");`,
      }}
    />
  );
}
