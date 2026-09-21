import { NavLink } from 'react-rauter';
import { useAuth } from '../contx/AuthContext';
import styles from './sidebar.module.css';

function Sidebar () {
    const {Logado, logout} = useAuth()
    const linkClass = ({ isActive }) =>
        isActive ? styles.link + ' ' + styles.ativo : styles.link;
    
    return(
        (<aside className ={styles.sidebar}>
            <div className={styles.logo}>
                <h1>TaskFlow</h1>
            </div>
            <nav className={styles.nov}>
                {Logado && <NavLink to='/' className={linkClass}>Dashboard</NavLink>}
            </nav>
            {Logado && (
                <button className={styles.logout } onClink={logout}>
                    Sair
                </button>
            )}
     </aside>)
    );
}
export default Sidebar;