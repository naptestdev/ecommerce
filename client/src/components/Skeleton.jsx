export default function Skeleton({ className, ...others }) {
  return (
    <div className={`bg-gray-300 animate-pulse ${className}`} {...others}></div>
  );
}
