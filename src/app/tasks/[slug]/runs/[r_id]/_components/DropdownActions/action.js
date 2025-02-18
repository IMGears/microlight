"use server";
// import analytics from '@/lib/analytics';
// import db from '@/database';

// export async function deleteRun(run) {
//     // const user = await loginRequired();
//     // analytics.track({event: 'part_delete', user: user.id, org: part.org});

//     // Check for existing versions
//     const versions = await db.PartVersions.findAll({
//         where: { quote: part.id},
//         raw: true
//     });

//     if (versions.length) {
//         return {
//             status: 'failed',
//             message: 'Part contains versions. Please delete the versions first.'
//         };
//     } else {
//         try {
//             await db.Parts.destroy({
//                 where: { id: part.id }
//             });

//             return {
//                 status: 'done',
//                 message: 'Part deleted.'
//             };
//         } catch (error) {
//             throw error;
//         }
//     }
// }
