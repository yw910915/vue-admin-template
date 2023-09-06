import { title } from "@/settings";

export const addTreeChild = (treeArray, key) => {
    let data = [...treeArray];
    data.forEach(item => {
        
        if (item.key == key) {
            const curChildLength = item.children ? item.children.length: 0
            const addChildren = {
                key: `${key}-${curChildLength+1}`
            }
            item.children = item.children && item.children.length>0 ? [...item.children,addChildren]: [addChildren]
        }
        if (item.children && Array.isArray(item.children)) {
            addTreeChild(item.children, key);
        }
    });
    return data;
}

function addTreeChild(treeArray, key) {
    let data = [...treeArray];
    data.forEach(item => {
        
        if (item.key == key) {
            const curChildLength = item.children ? item.children.length: 0
            const addChildren = {
                key: `${key}-${curChildLength+1}`,
                title: ' '
            }
            item.children = [addChildren]
            // if(item.children && item.children.length>0) {
            //     Object.assign(item.children, addChildren)
            // } else {
            //     Object.assign(item, {
            //         children: [addChildren]
            //     })
            // }
            // item.children = item.children && item.children.length>0 ? [...item.children,addChildren]: [addChildren]
        }
        if (item.children && Array.isArray(item.children)) {
            addTreeChild(item.children, key);
        }
    });
    return data;
}
const data = [
    {
        key: 1,
        title: "1.蓄电池放电",
    }
];
console.log(addTreeChild(data, 1));
