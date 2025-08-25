// import Url from './url';

// const baseUrl = `${Url}/users`;

// const checkDuplicate = async (field: string, value: string) => {
//     const response = await fetch(baseUrl);
//     if (!response.ok) {
//         throw new Error('ไม่สามารถดึงผู้ใช้ได้');
//     }
//     const users = await response.json();
//     return users.some((user: any) => user[field] === value);
// };

// const checkCredentials = async (email: string, password: string) => {
//     const response = await fetch(baseUrl);
//     if (!response.ok) {
//       throw new Error('ไม่สามารถดึงผู้ใช้ได้');
//     }
//     const users = await response.json();
//     return users.some((user: any) => user.email === email && user.password === password);
//   };

// export { checkDuplicate ,checkCredentials };
