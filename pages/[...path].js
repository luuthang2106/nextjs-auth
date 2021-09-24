import dynamic from 'next/dynamic'
import Routes from '_routes'
import DirectoryTree from 'directory-tree'

const directoryTree = DirectoryTree('_pages')
function flat(obj, item) {
    if (item.children) {
        return { ...obj, [item['name'].replace('.js', '')]: { ...item.children.reduce(flat, obj['name']) } }
    }

    return {
        ...obj,
        [item['name'].replace('.js', '')]: item.path
    }
}
const tree = directoryTree.children.reduce(flat, {})

const getPage = (tree, path) => {
    for (let i = 0, n = path.length; i < n; ++i) {
        let k = path[i];
        if (k in tree) {
            tree = tree[k];
        } else {
            return;
        }
    }
    return tree.replace(/\\/g, '/').replace('_pages/', '').replace('.js', '');
}

export async function getServerSideProps(ctx, pages = tree) {
    const { query, params: { path } } = ctx
    const url = getPage(tree, path)
    if (url) {
        const func = await import(`_pages/${url}.js`).then(module => module.getServerSideProps).catch(console.log)
        if (func === undefined) {
            return {
                props: {
                    path: url
                }
            }
        }

        return {
            props: {
                path: url
            }
        }
    } else {
        return {
            props: {}
        }
    }
}
export default function render(props) {
    if (props.path !== undefined) {
        const DynamicComponent = dynamic(() => import(`_pages/${props.path}.js`))
        return (
            <DynamicComponent {...props} />
        )
    } else {
        return (
            <div>Not founded</div>
        )
    }

}