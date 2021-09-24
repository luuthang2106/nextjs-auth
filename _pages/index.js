export async function getServerSideProps(context) {
    return {
      props: {}, // will be passed to the page component as props
    }
  }
export default function Home() {
    return (
        <div>Home page</div>
    )
}