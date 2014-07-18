package org.opendolphin.server.adapter

import org.opendolphin.core.comm.Codec
import org.opendolphin.core.server.ServerDolphin
import org.opendolphin.core.server.ServerConnector
import spock.lang.Specification

import javax.servlet.ServletInputStream
import javax.servlet.ServletOutputStream
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import java.util.logging.Level

class DolphinServletSpec extends Specification {

    void "calling doPost in new session must reach registration of custom actions - no logging"() {
        given:
        DolphinServlet.log.level = Level.OFF // for full branch coverage
        def (servlet, req, resp) = mockServlet(null)

        when:
        servlet.doPost(req, resp)

        then:
        servlet.registerReached
    }

    void "calling doPost in new session must reach registration of custom actions - all logging for branch coverage"() {
        given:
        DolphinServlet.log.level = Level.ALL // for full branch coverage
        def (servlet, req, resp) = mockServlet(null)

        when:
        servlet.doPost(req, resp)

        then:
        servlet.registerReached

    }

    void "calling doPost in existing session must not reach registration of custom actions"() {
        given:
        DolphinServlet.log.level = Level.ALL // for full branch coverage
        def (servlet, req, resp) = mockServlet(new ServerDolphin(null, mockServerConnector()))

        when:
        servlet.doPost(req, resp)

        then:
        servlet.registerReached == false

    }

    def mockServerConnector() {
        [
            getCodec: { [encode: {}, decode: { [null] }] as Codec },
            receive: { [] },
            serverModelStore: { setCurrentResponse: { } }
        ] as ServerConnector
    }

    def mockServlet(ServerDolphin serverDolphin) {
        ServerDolphin.metaClass.getServerConnector = {-> mockServerConnector() }

        def servlet = new TestDolphinServlet()
        def session = [
            setAttribute : { key, value -> },
            getAttribute : { serverDolphin },
            getId : { null }
        ] as HttpSession
        def iS = {} as ServletInputStream
        iS.metaClass.getText = {-> ' '}
        def req = [ getSession: {session}, getInputStream: { iS } ] as HttpServletRequest
        def oS = {} as ServletOutputStream
        oS.metaClass.leftShift = {}
        oS.metaClass.close = {->}
        def resp = [ getOutputStream: { oS } ] as HttpServletResponse
        return [ servlet, req, resp ]
    }

}

class TestDolphinServlet extends DolphinServlet {
    boolean registerReached

    @Override
    protected void registerApplicationActions(ServerDolphin serverDolphin) {
        registerReached = true
    }

    def getLog = [info: {}]
}
